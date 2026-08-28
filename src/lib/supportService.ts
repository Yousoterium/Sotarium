export interface SupportMessage {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userTag: string;
  userIp?: string;
  status: "open" | "resolved";
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

const STORAGE_TICKET_KEY = "sotarium_support_ticket_id";
const STORAGE_USER_NAME_KEY = "sotarium_support_user_name";
const STORAGE_LOCAL_TICKETS_KEY = "sotarium_local_tickets_backup";
const ADMIN_IP = "24.49.252.230";

// Helper for local ticket store fallback (e.g. during local testing / offline)
function getLocalStoredTickets(): Record<string, SupportTicket> {
  try {
    const raw = localStorage.getItem(STORAGE_LOCAL_TICKETS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalStoredTickets(tickets: Record<string, SupportTicket>) {
  try {
    localStorage.setItem(STORAGE_LOCAL_TICKETS_KEY, JSON.stringify(tickets));
  } catch {}
}

export const supportService = {
  getStoredUserName(): string {
    try {
      return localStorage.getItem(STORAGE_USER_NAME_KEY) || "";
    } catch {
      return "";
    }
  },

  setStoredUserName(name: string) {
    try {
      localStorage.setItem(STORAGE_USER_NAME_KEY, name.trim());
    } catch {}
  },

  getOrCreateTicketId(): string {
    try {
      let id = localStorage.getItem(STORAGE_TICKET_KEY);
      if (!id) {
        id = `ticket_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        localStorage.setItem(STORAGE_TICKET_KEY, id);
      }
      return id;
    } catch {
      return `ticket_${Date.now().toString(36)}`;
    }
  },

  resetTicketId(): string {
    try {
      const id = `ticket_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem(STORAGE_TICKET_KEY, id);
      return id;
    } catch {
      return `ticket_${Date.now().toString(36)}`;
    }
  },

  async checkIsAdmin(): Promise<{ isAdmin: boolean; clientIp: string }> {
    let clientIp = "";
    let serverAdmin = false;

    try {
      const res = await fetch("/api/support?action=check_admin", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.isAdmin) return { isAdmin: true, clientIp: data.clientIp || "" };
        clientIp = data.clientIp || "";
        serverAdmin = Boolean(data.isAdmin);
      }
    } catch {
      // Ignore network errors in dev
    }

    // Client-side fallback check (e.g. via IP lookup if serverless endpoint is bypassed)
    try {
      if (!clientIp) {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          clientIp = ipData.ip;
        }
      }
    } catch {}

    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "::1");

    const isMatch = clientIp === ADMIN_IP || clientIp.includes(ADMIN_IP) || isLocal || serverAdmin;

    return {
      isAdmin: isMatch,
      clientIp: clientIp || (isLocal ? "127.0.0.1" : "unknown"),
    };
  },

  async getTicket(ticketId: string): Promise<SupportTicket> {
    try {
      const res = await fetch(`/api/support?action=get_ticket&ticketId=${encodeURIComponent(ticketId)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          // Sync with local store
          const local = getLocalStoredTickets();
          local[ticketId] = data.ticket;
          saveLocalStoredTickets(local);
          return data.ticket;
        }
      }
    } catch {}

    // Fallback to local store
    const local = getLocalStoredTickets();
    if (local[ticketId]) {
      return local[ticketId];
    }

    return {
      id: ticketId,
      userTag: supportService.getStoredUserName() || "Guest",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
  },

  async sendMessage(
    ticketId: string,
    text: string,
    sender: "user" | "admin",
    senderName?: string
  ): Promise<{ success: boolean; message: SupportMessage; ticket: SupportTicket }> {
    const payload = {
      action: "send_message",
      ticketId,
      text: text.trim(),
      sender,
      senderName: senderName?.trim() || (sender === "admin" ? "Sotarium Support" : "User"),
    };

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.ticket) {
          const local = getLocalStoredTickets();
          local[ticketId] = data.ticket;
          saveLocalStoredTickets(local);
          return data;
        }
      }
    } catch {}

    // Local client-side fallback simulation
    const now = new Date().toISOString();
    const local = getLocalStoredTickets();
    let ticket = local[ticketId];
    if (!ticket) {
      ticket = {
        id: ticketId,
        userTag: payload.senderName || "Guest",
        status: "open",
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
    }

    const newMsg: SupportMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sender,
      senderName: payload.senderName,
      text: payload.text,
      timestamp: now,
    };

    ticket.messages.push(newMsg);
    ticket.updatedAt = now;
    if (sender === "user" && ticket.status === "resolved") {
      ticket.status = "open";
    }
    local[ticketId] = ticket;
    saveLocalStoredTickets(local);

    return {
      success: true,
      message: newMsg,
      ticket,
    };
  },

  async listTickets(): Promise<SupportTicket[]> {
    try {
      const res = await fetch("/api/support?action=list_tickets", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tickets)) {
          // Merge with local fallback
          const local = getLocalStoredTickets();
          data.tickets.forEach((t: SupportTicket) => {
            local[t.id] = t;
          });
          saveLocalStoredTickets(local);
          return data.tickets;
        }
      }
    } catch {}

    const local = getLocalStoredTickets();
    return Object.values(local).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  async updateTicketStatus(ticketId: string, status: "open" | "resolved"): Promise<boolean> {
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", ticketId, status }),
      });
      if (res.ok) {
        const local = getLocalStoredTickets();
        if (local[ticketId]) {
          local[ticketId].status = status;
          local[ticketId].updatedAt = new Date().toISOString();
          saveLocalStoredTickets(local);
        }
        return true;
      }
    } catch {}

    const local = getLocalStoredTickets();
    if (local[ticketId]) {
      local[ticketId].status = status;
      local[ticketId].updatedAt = new Date().toISOString();
      saveLocalStoredTickets(local);
      return true;
    }
    return false;
  },

  async deleteTicket(ticketId: string): Promise<boolean> {
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_ticket", ticketId }),
      });
      if (res.ok) {
        const local = getLocalStoredTickets();
        delete local[ticketId];
        saveLocalStoredTickets(local);
        return true;
      }
    } catch {}

    const local = getLocalStoredTickets();
    delete local[ticketId];
    saveLocalStoredTickets(local);
    return true;
  },
};
