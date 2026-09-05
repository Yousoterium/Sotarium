import { useState, useEffect } from "react";
import { ScriptsPage } from "./components/ScriptsPage";
import { InfosPage } from "./components/InfosPage";
import { ProviderPage } from "./components/ProviderPage";
import { KeyProviderPage } from "./components/KeyProviderPage";
import { LogsPage } from "./components/LogsPage";
import { AsciiCanvas } from "./components/AsciiCanvas";

function App() {
  const [currentRoute, setCurrentRoute] = useState<{
    page: "home" | "scripts" | "infos" | "provider" | "key" | "logs";
    providerId?: string;
  }>(() => {
    const p = window.location.pathname;
    if (p === "/logs" || p.startsWith("/logs")) return { page: "logs" };
    if (p === "/scripts") return { page: "scripts" };
    if (p === "/infos") return { page: "infos" };
    if (p === "/provider") return { page: "provider" };
    if (
      p === "/workink" ||
      p.startsWith("/workink") ||
      p === "/verify" ||
      p.startsWith("/verify") ||
      p === "/lootlabs" ||
      p.startsWith("/lootlabs")
    ) {
      return { page: "key", providerId: "workink" };
    }
    if (p.startsWith("/key/")) {
      const prov = p.replace("/key/", "").split("/")[0] || "workink";
      return { page: "key", providerId: prov };
    }
    return { page: "home" };
  });

  const navigateTo = (
    newPage: "home" | "scripts" | "infos" | "provider" | "key" | "logs",
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
          : newPage === "logs"
          ? "Logs · Sotarium"
          : "Sotarium";
    }

    window.history.pushState({ page: newPage, providerId }, "", targetUrl);
    document.title = title;
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === "/logs" || p.startsWith("/logs")) setCurrentRoute({ page: "logs" });
      else if (p === "/scripts") setCurrentRoute({ page: "scripts" });
      else if (p === "/infos") setCurrentRoute({ page: "infos" });
      else if (p === "/provider") setCurrentRoute({ page: "provider" });
      else if (
        p === "/workink" ||
        p.startsWith("/workink") ||
        p === "/verify" ||
        p.startsWith("/verify") ||
        p === "/lootlabs" ||
        p.startsWith("/lootlabs")
      ) {
        setCurrentRoute({ page: "key", providerId: "workink" });
      } else if (p.startsWith("/key/")) {
        const prov = p.replace("/key/", "").split("/")[0] || "workink";
        setCurrentRoute({ page: "key", providerId: prov });
      } else setCurrentRoute({ page: "home" });
    };

    window.addEventListener("popstate", handlePopState);

    const path = window.location.pathname;
    if (path === "/logs" || path.startsWith("/logs")) {
      setCurrentRoute({ page: "logs" });
    } else if (path === "/workink" || path.startsWith("/workink") || path === "/verify" || path.startsWith("/verify") || path === "/lootlabs") {
      setCurrentRoute({ page: "key", providerId: "workink" });
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const renderPage = () => {
    if (currentRoute.page === "logs") {
      return (
        <LogsPage
          logs={[]}
          onBack={() => navigateTo("home")}
          onClear={() => {}}
        />
      );
    }

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
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 max-w-xl">
        {/* Mascot */}
        <img
          src="https://i.imgur.com/sZZvbs8.png"
          alt="Sotarium"
          className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
        />

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-sm">
          Sotarium
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 w-full max-w-sm mt-3">
          <a
            href="/provider"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("provider");
            }}
            className="btn-zebra w-36 h-12 cursor-pointer no-underline select-none"
          >
            Get Key
          </a>

          <a
            href="https://discord.gg/3aghbJBybQ"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-zebra w-36 h-12 cursor-pointer no-underline select-none"
          >
            Join Discord
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0d] text-white flex flex-col items-center justify-center select-none antialiased">
      {/* Global Persistent Animated Dot Canvas - Never resets or shifts across URLs */}
      <AsciiCanvas
        className="pointer-events-none fixed inset-0 opacity-[0.75] [mask-image:radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.35)_18%,rgba(0,0,0,0.85)_45%,#000_70%)] [-webkit-mask-image:radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.35)_18%,rgba(0,0,0,0.85)_45%,#000_70%)]"
        color="#0099ff"
        speed={18}
        cellSize={16}
        mode="dots"
      />

      {/* Main Page Viewport */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center pointer-events-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
