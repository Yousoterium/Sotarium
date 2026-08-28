import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const ALLOWED_ADMIN_IPS = ["24.49.252.230", "127.0.0.1", "::1", "localhost"];

// In-memory persistent store across serverless warm executions
if (!globalThis._supportStore) {
  globalThis._supportStore = {
    tickets: new Map(), // ticketId -> { id, userTag, userIp, createdAt, updatedAt, status: 'open' | 'resolved', messages: [] }
  };
}
const store = globalThis._supportStore;

function normalizeIp(value) {
  if (!value || typeof value !== "string") return "";
  let ip = value.trim();
  if (ip.includes(",")) ip = ip.split(",")[0].trim();
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  if (ip.startsWith("[") && ip.endsWith("]")) ip = ip.slice(1, -1);
  return ip || "";
}

function getClientIp(req) {
  const forwarded = req.headers["x-vercel-forwarded-for"] ||
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "";
  return normalizeIp(forwarded);
}

function isUserAdmin(clientIp) {
  if (!clientIp) return false;
  const configured = process.env.SUPPORT_ADMIN_IPS
    ? process.env.SUPPORT_ADMIN_IPS.split(",").map(normalizeIp).filter(Boolean)
    : ALLOWED_ADMIN_IPS;
  return configured.includes(clientIp) || clientIp === "24.49.252.230" || clientIp === "127.0.0.1" || clientIp === "::1";
}

function getSupabaseClient() {
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createClient(SUPABASE_URL, key);
}

async function tryPersistToSupabase(ticketId, message) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.from("logs").insert([
      {
        provider_name: "Support",
        message: `[Ticket ${ticketId.slice(0, 8)}] ${message.sender === "admin" ? "Staff" : message.senderName || "User"}: ${message.text}`,
        status: message.sender === "admin" ? "info" : "pending",
      },
    ]).catch(() => {});
  } catch {
    // Non-fatal if logs table is not present
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const clientIp = getClientIp(req);
  const isAdmin = isUserAdmin(clientIp);

  // 1. GET Actions
  if (req.method === "GET") {
    const action = req.query.action || "check_admin";

    if (action === "check_admin") {
      return res.status(200).json({
        isAdmin,
        clientIp,
      });
    }

    if (action === "get_ticket") {
      const ticketId = String(req.query.ticketId || "").trim();
      if (!ticketId) {
        return res.status(400).json({ error: "Missing ticketId" });
      }
      const ticket = store.tickets.get(ticketId) || {
        id: ticketId,
        userTag: "Guest",
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      return res.status(200).json({ ticket });
    }

    if (action === "list_tickets") {
      if (!isAdmin) {
        return res.status(403).json({ error: "Unauthorized. Admin IP required." });
      }
      const ticketList = Array.from(store.tickets.values()).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      return res.status(200).json({ tickets: ticketList });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  // 2. POST Actions
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const action = body?.action || "send_message";

    if (action === "send_message") {
      const ticketId = String(body.ticketId || "").trim();
      const text = String(body.text || "").trim();
      const sender = body.sender === "admin" && isAdmin ? "admin" : "user";
      const senderName = String(body.senderName || (sender === "admin" ? "Sotarium Support" : "User")).trim();

      if (!ticketId || !text) {
        return res.status(400).json({ error: "Missing ticketId or text" });
      }

      const now = new Date().toISOString();
      let ticket = store.tickets.get(ticketId);
      if (!ticket) {
        ticket = {
          id: ticketId,
          userTag: senderName || "Guest",
          userIp: clientIp,
          status: "open",
          createdAt: now,
          updatedAt: now,
          messages: [],
        };
        store.tickets.set(ticketId, ticket);
      } else {
        ticket.updatedAt = now;
        if (sender === "user" && senderName && senderName !== "Guest") {
          ticket.userTag = senderName;
        }
      }

      const msg = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        sender,
        senderName: sender === "admin" ? "Sotarium Support" : (senderName || ticket.userTag || "User"),
        text,
        timestamp: now,
      };

      ticket.messages.push(msg);
      if (sender === "user" && ticket.status === "resolved") {
        ticket.status = "open";
      }

      tryPersistToSupabase(ticketId, msg);

      return res.status(200).json({
        success: true,
        message: msg,
        ticket,
      });
    }

    if (action === "update_status") {
      if (!isAdmin) {
        return res.status(403).json({ error: "Unauthorized. Admin IP required." });
      }
      const ticketId = String(body.ticketId || "").trim();
      const status = body.status === "resolved" ? "resolved" : "open";
      const ticket = store.tickets.get(ticketId);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      return res.status(200).json({ success: true, ticket });
    }

    if (action === "delete_ticket") {
      if (!isAdmin) {
        return res.status(403).json({ error: "Unauthorized. Admin IP required." });
      }
      const ticketId = String(body.ticketId || "").trim();
      store.tickets.delete(ticketId);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
