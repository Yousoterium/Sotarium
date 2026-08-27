import { useState, useEffect } from "react";
import { ScriptsPage } from "./components/ScriptsPage";
import { InfosPage } from "./components/InfosPage";
import { ProviderPage } from "./components/ProviderPage";
import { KeyProviderPage } from "./components/KeyProviderPage";

function App() {
  const [currentRoute, setCurrentRoute] = useState<{
    page: "home" | "scripts" | "infos" | "provider" | "key";
    providerId?: string;
  }>(() => {
    const p = window.location.pathname;
    if (p === "/scripts") return { page: "scripts" };
    if (p === "/infos") return { page: "infos" };
    if (p === "/provider") return { page: "provider" };
    if (p.startsWith("/key/")) {
      const prov = p.replace("/key/", "").split("/")[0] || "workink";
      return { page: "key", providerId: prov };
    }
    return { page: "home" };
  });

  const navigateTo = (
    newPage: "home" | "scripts" | "infos" | "provider" | "key",
    providerId?: string
  ) => {
    setCurrentRoute({ page: newPage, providerId });
    let targetUrl = "/";
    let title = "Sotarium";

    if (newPage === "key" && providerId) {
      targetUrl = `/key/${providerId}`;
      title = `${providerId.charAt(0).toUpperCase() + providerId.slice(1)} Key · Sotarium`;
    } else if (newPage !== "home") {
      targetUrl = `/${newPage}`;
      title =
        newPage === "scripts"
          ? "Scripts Studio"
          : newPage === "infos"
          ? "Infos · Sotarium"
          : newPage === "provider"
          ? "Select Provider · Sotarium"
          : "Sotarium";
    }

    window.history.pushState({ page: newPage, providerId }, "", targetUrl);
    document.title = title;
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === "/scripts") setCurrentRoute({ page: "scripts" });
      else if (p === "/infos") setCurrentRoute({ page: "infos" });
      else if (p === "/provider") setCurrentRoute({ page: "provider" });
      else if (p.startsWith("/key/")) {
        const prov = p.replace("/key/", "").split("/")[0] || "workink";
        setCurrentRoute({ page: "key", providerId: prov });
      } else setCurrentRoute({ page: "home" });
    };

    window.addEventListener("popstate", handlePopState);

    const path = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);

    if (path === "/lootlabs" && (params.has("verify") || params.has("verify1") || params.has("verify2"))) {
      navigateTo("key", "workink");
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (currentRoute.page === "provider") {
    return (
      <ProviderPage
        onSelectProvider={(provId) => navigateTo("key", provId)}
        onBack={() => navigateTo("home")}
      />
    );
  }

  if (currentRoute.page === "key") {
    return (
      <KeyProviderPage
        providerId={currentRoute.providerId || "workink"}
        onGoHome={() => navigateTo("home")}
      />
    );
  }

  if (currentRoute.page === "infos") {
    return <InfosPage onBack={() => navigateTo("home")} />;
  }

  if (currentRoute.page === "scripts") {
    return <ScriptsPage onBack={() => navigateTo("home")} />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex flex-col items-center justify-center font-sans select-none antialiased">
      {/* Soft Gray Dot Grid Background (Reverted, No Planet) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Main Centered Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center gap-9 py-12">
        {/* Mascot & Title */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://i.imgur.com/sZZvbs8.png"
            alt="Sotarium"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md rounded-full"
          />

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
            Sotarium
          </h1>
        </div>

        {/* Action Buttons: Get Key + Join Discord */}
        <div className="flex items-center justify-center gap-3 w-full max-w-sm">
          {/* Get Key Button */}
          <a
            href="/provider"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("provider");
            }}
            className="w-36 h-11 rounded-full border border-white/[0.18] bg-[#141417]/80 hover:bg-[#1c1c20] hover:border-white/[0.3] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white flex items-center justify-center no-underline whitespace-nowrap"
          >
            Get Key
          </a>

          {/* Join Discord Button */}
          <a
            href="https://discord.gg/3aghbJBybQ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-36 h-11 rounded-full border border-white/[0.18] bg-[#141417]/80 hover:bg-[#1c1c20] hover:border-white/[0.3] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white flex items-center justify-center no-underline whitespace-nowrap"
          >
            Join Discord
          </a>
        </div>
      </main>
    </div>
  );
}

export default App;
