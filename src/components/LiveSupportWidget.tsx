import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  LifeBuoy,
  Inbox,
  User,
  Shield,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  ChevronLeft,
  Trash2,
  Check,
  Sparkles,
  Headphones
} from "lucide-react";
import { supportService, SupportTicket, SupportMessage } from "../lib/supportService";

export const LiveSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [clientIp, setClientIp] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"chat" | "tickets">("chat");

  // User chat state
  const [ticketId, setTicketId] = useState<string>(() => supportService.getOrCreateTicketId());
  const [userName, setUserName] = useState<string>(() => supportService.getStoredUserName());
  const [tempName, setTempName] = useState<string>(() => supportService.getStoredUserName());
  const [userTicket, setUserTicket] = useState<SupportTicket | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  // Admin tickets state
  const [ticketsList, setTicketsList] = useState<SupportTicket[]>([]);
  const [selectedAdminTicket, setSelectedAdminTicket] = useState<SupportTicket | null>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>("");
  const [ticketSearch, setTicketSearch] = useState<string>("");
  const [ticketFilter, setTicketFilter] = useState<"all" | "open" | "resolved">("all");
  const [isLoadingTickets, setIsLoadingTickets] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const adminChatEndRef = useRef<HTMLDivElement>(null);

  // Check admin rights on mount
  useEffect(() => {
    async function initAdmin() {
      const res = await supportService.checkIsAdmin();
      setIsAdmin(res.isAdmin);
      setClientIp(res.clientIp);
    }
    void initAdmin();
  }, []);

  // Poll user ticket messages
  const loadUserTicket = async () => {
    if (!ticketId) return;
    const ticket = await supportService.getTicket(ticketId);
    setUserTicket(ticket);
  };

  useEffect(() => {
    void loadUserTicket();
  }, [ticketId]);

  // Auto-refresh chat messages when widget is open on chat tab
  useEffect(() => {
    if (!isOpen || activeTab !== "chat") return;
    const interval = setInterval(() => {
      void loadUserTicket();
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, activeTab, ticketId]);

  // Load tickets for admin
  const loadAdminTickets = async () => {
    if (!isAdmin) return;
    setIsLoadingTickets(true);
    try {
      const list = await supportService.listTickets();
      setTicketsList(list);
      // If currently viewing a ticket in admin view, refresh it
      if (selectedAdminTicket) {
        const updated = list.find((t) => t.id === selectedAdminTicket.id);
        if (updated) setSelectedAdminTicket(updated);
      }
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      void loadAdminTickets();
    }
  }, [isAdmin]);

  // Auto-refresh admin tickets
  useEffect(() => {
    if (!isOpen || !isAdmin || activeTab !== "tickets") return;
    const interval = setInterval(() => {
      void loadAdminTickets();
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, isAdmin, activeTab, selectedAdminTicket?.id]);

  // Scroll to bottom of active chat
  useEffect(() => {
    if (activeTab === "chat" && isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [userTicket?.messages, isOpen, activeTab]);

  useEffect(() => {
    if (activeTab === "tickets" && selectedAdminTicket && isOpen) {
      adminChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedAdminTicket?.messages, isOpen, activeTab]);

  // Send message as User (or Admin testing user chat)
  const handleUserSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    const displayName = userName.trim() || (isAdmin ? "Admin (You)" : "Guest");
    try {
      const res = await supportService.sendMessage(ticketId, text, "user", displayName);
      if (res.ticket) {
        setUserTicket(res.ticket);
      }
      if (isAdmin) {
        void loadAdminTickets();
      }
    } finally {
      setIsSending(false);
    }
  };

  // Send reply as Admin
  const handleAdminSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedAdminTicket || !adminReplyText.trim() || isSending) return;

    const text = adminReplyText.trim();
    setAdminReplyText("");
    setIsSending(true);

    try {
      const res = await supportService.sendMessage(
        selectedAdminTicket.id,
        text,
        "admin",
        "Sotarium Support"
      );
      if (res.ticket) {
        setSelectedAdminTicket(res.ticket);
        setTicketsList((prev) =>
          prev.map((t) => (t.id === res.ticket.id ? res.ticket : t))
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      supportService.setStoredUserName(tempName.trim());
    }
  };

  const handleStartNewTicket = () => {
    const newId = supportService.resetTicketId();
    setTicketId(newId);
    setUserTicket(null);
  };

  const handleToggleResolveAdminTicket = async (ticket: SupportTicket) => {
    const newStatus = ticket.status === "open" ? "resolved" : "open";
    await supportService.updateTicketStatus(ticket.id, newStatus);
    const updated = { ...ticket, status: newStatus as "open" | "resolved" };
    setSelectedAdminTicket(updated);
    setTicketsList((prev) => prev.map((t) => (t.id === ticket.id ? updated : t)));
  };

  const handleDeleteAdminTicket = async (ticketIdToDelete: string) => {
    await supportService.deleteTicket(ticketIdToDelete);
    setTicketsList((prev) => prev.filter((t) => t.id !== ticketIdToDelete));
    if (selectedAdminTicket?.id === ticketIdToDelete) {
      setSelectedAdminTicket(null);
    }
  };

  const openTicketsCount = ticketsList.filter((t) => t.status === "open").length;

  const filteredTickets = ticketsList.filter((t) => {
    if (ticketFilter !== "all" && t.status !== ticketFilter) return false;
    if (!ticketSearch.trim()) return true;
    const query = ticketSearch.toLowerCase();
    const matchesUser = t.userTag.toLowerCase().includes(query) || (t.userIp && t.userIp.includes(query));
    const matchesMsg = t.messages.some((m) => m.text.toLowerCase().includes(query));
    return matchesUser || matchesMsg;
  });

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none font-sans text-white">
      {/* 1. Collapsed Floating Trigger Button: "Message Us" */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            if (isAdmin) void loadAdminTickets();
          }}
          className="group relative flex items-center gap-2.5 rounded-full border border-white/[0.18] bg-[#141417]/95 px-5 py-3.5 text-sm font-bold text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-emerald-400/50 hover:bg-[#1c1c22] hover:shadow-[0_0_25px_rgba(26,245,19,0.25)] active:scale-95 cursor-pointer"
        >
          {/* Glowing Green Online Indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1AF513] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1AF513]" />
          </span>

          <MessageSquare className="h-4 w-4 text-white transition-transform duration-200 group-hover:scale-110" />
          <span>Message Us</span>

          {/* Admin badge if tickets waiting */}
          {isAdmin && openTicketsCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white shadow-md animate-bounce">
              {openTicketsCount}
            </span>
          )}
        </button>
      )}

      {/* 2. Expanded Live Support Widget Window */}
      {isOpen && (
        <div className="flex h-[560px] max-h-[calc(100vh-3rem)] w-[380px] sm:w-[420px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c0c0f]/95 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="border-b border-white/[0.08] bg-[#141418]/80 px-4 py-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-[#1AF513]">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black tracking-tight text-white">Sotarium Support</h3>
                    <span className="flex h-2 w-2 rounded-full bg-[#1AF513]" />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {isAdmin ? `Admin Mode (${clientIp || "Verified IP"})` : "Live Chat · Instant Assistance"}
                  </p>
                </div>
              </div>

              {/* Close Button (X) */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                title="Close (X)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Admin Switcher Tabs: Message Us (Chat) vs Tickets */}
            {isAdmin && (
              <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-black/40 p-1 border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "chat"
                      ? "bg-white/10 text-white shadow-sm border border-white/10"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Message Us</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("tickets");
                    void loadAdminTickets();
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "tickets"
                      ? "bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Inbox className="h-3.5 w-3.5" />
                  <span>Tickets</span>
                  {openTicketsCount > 0 && (
                    <span className="rounded-full bg-emerald-500/30 px-1.5 py-0.2 text-[10px] text-emerald-300 font-extrabold">
                      {openTicketsCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Body: Tab 1 - Visitor Chat ("Message Us") */}
          {activeTab === "chat" && (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Optional User Name bar */}
              <div className="flex items-center justify-between border-b border-white/[0.04] bg-white/[0.02] px-4 py-2 text-xs">
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Your Name / Roblox User"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStartNewTicket}
                  title="Start New Chat Thread"
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>New Chat</span>
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Welcome message bubble */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[#1AF513] border border-emerald-500/30 text-xs font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="max-w-[82%] rounded-2xl rounded-tl-sm border border-white/[0.08] bg-[#18181c] p-3 text-xs leading-relaxed text-zinc-200 shadow-md">
                    <p className="font-semibold text-white mb-1">Welcome to Sotarium Support!</p>
                    <p>
                      How can we assist you today with keys, Roblox scripts, or verification? Send us a message below and our team will get right on it.
                    </p>
                    <span className="mt-2 block text-[10px] text-zinc-500">Live Support Bot</span>
                  </div>
                </div>

                {/* Live ticket messages */}
                {userTicket?.messages && userTicket.messages.length > 0 ? (
                  userTicket.messages.map((msg) => {
                    const isStaff = msg.sender === "admin";
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${isStaff ? "justify-start" : "justify-end"}`}
                      >
                        {isStaff && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[#1AF513] border border-emerald-500/30 text-xs font-bold">
                            <Shield className="h-3.5 w-3.5" />
                          </div>
                        )}

                        <div
                          className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                            isStaff
                              ? "rounded-tl-sm border border-emerald-500/30 bg-[#141d18] text-emerald-100"
                              : "rounded-tr-sm border border-white/[0.12] bg-[#1e1e24] text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span
                              className={`text-[10px] font-black ${
                                isStaff ? "text-emerald-400 flex items-center gap-1" : "text-zinc-400"
                              }`}
                            >
                              {msg.senderName || (isStaff ? "Sotarium Support" : "You")}
                              {isStaff && <CheckCircle2 className="h-2.5 w-2.5" />}
                            </span>
                            <span className="text-[9px] text-zinc-500">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                ) : null}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleUserSendMessage} className="border-t border-white/[0.08] bg-[#121216] p-3 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="flex-1 rounded-xl border border-white/[0.08] bg-[#18181d] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-white/30 focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition disabled:opacity-40 cursor-pointer shadow-md"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* Body: Tab 2 - Admin Tickets Viewer */}
          {activeTab === "tickets" && isAdmin && (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* If viewing a specific ticket details */}
              {selectedAdminTicket ? (
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Ticket Header Controls */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#131317] px-3 py-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedAdminTicket(null)}
                      className="flex items-center gap-1 text-zinc-300 hover:text-white transition cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="font-bold">All Tickets</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleResolveAdminTicket(selectedAdminTicket)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                          selectedAdminTicket.status === "resolved"
                            ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                            : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        }`}
                      >
                        {selectedAdminTicket.status === "resolved" ? "Reopen" : "Mark Resolved"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAdminTicket(selectedAdminTicket.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                        title="Delete Ticket"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ticket User Info Subbar */}
                  <div className="border-b border-white/[0.04] bg-white/[0.02] px-4 py-1.5 text-[11px] text-zinc-400 flex items-center justify-between">
                    <span className="font-semibold text-zinc-200">
                      User: {selectedAdminTicket.userTag} {selectedAdminTicket.userIp ? `(${selectedAdminTicket.userIp})` : ""}
                    </span>
                    <span className="text-[10px] text-zinc-500">ID: {selectedAdminTicket.id.slice(0, 10)}...</span>
                  </div>

                  {/* Messages Feed in Selected Ticket */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedAdminTicket.messages.length === 0 ? (
                      <p className="text-center text-xs text-zinc-500 mt-6">No messages in this ticket yet.</p>
                    ) : (
                      selectedAdminTicket.messages.map((msg) => {
                        const isStaff = msg.sender === "admin";
                        return (
                          <div
                            key={msg.id}
                            className={`flex items-start gap-2.5 ${isStaff ? "justify-end" : "justify-start"}`}
                          >
                            {!isStaff && (
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-bold">
                                <User className="h-3.5 w-3.5" />
                              </div>
                            )}

                            <div
                              className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                                isStaff
                                  ? "rounded-tr-sm border border-emerald-500/30 bg-[#141d18] text-emerald-100"
                                  : "rounded-tl-sm border border-white/[0.12] bg-[#1e1e24] text-white"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <span
                                  className={`text-[10px] font-black ${
                                    isStaff ? "text-emerald-400 flex items-center gap-1" : "text-amber-400"
                                  }`}
                                >
                                  {isStaff ? "You (Staff)" : (msg.senderName || selectedAdminTicket.userTag || "Visitor")}
                                </span>
                                <span className="text-[9px] text-zinc-500">
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={adminChatEndRef} />
                  </div>

                  {/* Admin Reply Form */}
                  <form onSubmit={handleAdminSendReply} className="border-t border-white/[0.08] bg-[#121216] p-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder="Reply to user as Support Staff..."
                      disabled={isSending}
                      className="flex-1 rounded-xl border border-white/[0.08] bg-[#18181d] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={!adminReplyText.trim() || isSending}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition disabled:opacity-40 cursor-pointer shadow-md"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                /* Ticket List Overview */
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Search & Filter Bar */}
                  <div className="border-b border-white/[0.06] bg-[#101014] p-3 space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search tickets by user or text..."
                        value={ticketSearch}
                        onChange={(e) => setTicketSearch(e.target.value)}
                        className="w-full rounded-lg border border-white/[0.08] bg-[#17171c] pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        {(["all", "open", "resolved"] as const).map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setTicketFilter(filter)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition cursor-pointer ${
                              ticketFilter === filter
                                ? "bg-white/15 text-white"
                                : "text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={loadAdminTickets}
                        className="text-[11px] text-zinc-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className={`h-3 w-3 ${isLoadingTickets ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Tickets */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {filteredTickets.length === 0 ? (
                      <div className="text-center py-10 text-zinc-500 text-xs">
                        <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p>No support tickets found.</p>
                        <p className="text-[10px] mt-1 text-zinc-600">Messages sent by visitors will appear here live.</p>
                      </div>
                    ) : (
                      filteredTickets.map((ticket) => {
                        const lastMessage = ticket.messages[ticket.messages.length - 1];
                        const isResolved = ticket.status === "resolved";
                        const unread = !isResolved && lastMessage?.sender === "user";

                        return (
                          <div
                            key={ticket.id}
                            onClick={() => setSelectedAdminTicket(ticket)}
                            className={`rounded-xl border p-3 transition-all cursor-pointer ${
                              unread
                                ? "border-emerald-500/40 bg-emerald-500/[0.05] hover:bg-emerald-500/[0.08]"
                                : "border-white/[0.06] bg-[#141418] hover:bg-[#19191f]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-white">{ticket.userTag}</span>
                                {ticket.userIp && (
                                  <span className="text-[10px] text-zinc-500 font-mono">({ticket.userIp})</span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    isResolved
                                      ? "bg-zinc-800 text-zinc-400"
                                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  }`}
                                >
                                  {ticket.status}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-zinc-300 line-clamp-2">
                              {lastMessage ? (
                                <span>
                                  <strong className="text-zinc-400">{lastMessage.sender === "admin" ? "You: " : "" }</strong>
                                  {lastMessage.text}
                                </span>
                              ) : (
                                <span className="italic text-zinc-500">Ticket created, waiting for user message.</span>
                              )}
                            </p>

                            <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                              <span>{ticket.messages.length} messages</span>
                              <span>
                                {new Date(ticket.updatedAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
