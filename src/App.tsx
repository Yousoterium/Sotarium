import { useState, useEffect } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage } from "./components/AddGamePage";
import { ScriptsPage } from "./components/ScriptsPage";
import { InfosPage } from "./components/InfosPage";
import { ProviderPage } from "./components/ProviderPage";
import { KeyProviderPage } from "./components/KeyProviderPage";

function App() {
  const [currentRoute, setCurrentRoute] = useState<{
    page: "home" | "products" | "add" | "scripts" | "infos" | "provider" | "key";
    providerId?: string;
  }>(() => {
    const p = window.location.pathname;
    if (p === "/scripts") return { page: "scripts" };
    if (p === "/add") return { page: "add" };
    if (p === "/products") return { page: "products" };
    if (p === "/infos") return { page: "infos" };
    if (p === "/provider") return { page: "provider" };
    if (p.startsWith("/key/")) {
      const prov = p.replace("/key/", "").split("/")[0] || "lootlabs";
      return { page: "key", providerId: prov };
    }
    return { page: "home" };
  });

  const navigateTo = (
    newPage: "home" | "products" | "add" | "scripts" | "infos" | "provider" | "key",
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
          : newPage === "add"
          ? "Add Game"
          : newPage === "products"
          ? "Products"
          : newPage === "infos"
          ? "Infos · Sotarium"
          : newPage === "provider"
          ? "Choose Provider · Sotarium"
          : "Sotarium";
    }

    window.history.pushState({ page: newPage, providerId }, "", targetUrl);
    document.title = title;
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === "/scripts") setCurrentRoute({ page: "scripts" });
      else if (p === "/add") setCurrentRoute({ page: "add" });
      else if (p === "/products") setCurrentRoute({ page: "products" });
      else if (p === "/infos") setCurrentRoute({ page: "infos" });
      else if (p === "/provider") setCurrentRoute({ page: "provider" });
      else if (p.startsWith("/key/")) {
        const prov = p.replace("/key/", "").split("/")[0] || "lootlabs";
        setCurrentRoute({ page: "key", providerId: prov });
      } else setCurrentRoute({ page: "home" });
    };

    window.addEventListener("popstate", handlePopState);

    const path = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);

    // Support legacy lootlabs callback redirect
    if (path === "/lootlabs" && (params.has("verify") || params.has("verify1") || params.has("verify2"))) {
      navigateTo("key", "lootlabs");
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
        providerId={currentRoute.providerId || "lootlabs"}
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

  if (currentRoute.page === "add") {
    return <AddGamePage onBack={() => navigateTo("home")} />;
  }

  if (currentRoute.page === "products") {
    return <ProductsPage onBack={() => navigateTo("home")} />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex flex-col items-center justify-center font-sans select-none antialiased">
      {/* Clean Subtle Dot Grid Background */}
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
            src="https://i.imgur.com/qye2L7M.png"
            alt="Sotarium"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md"
          />

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
            Sotarium
          </h1>
        </div>

        {/* Action Buttons: Get Key navigates to /provider */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          {/* Get Key Button */}
          <a
            href="/provider"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("provider");
            }}
            className="flex-1 py-3 px-6 rounded-full border border-white/[0.12] bg-[#141417] hover:bg-[#1c1c20] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white flex items-center justify-center no-underline"
          >
            Get Key
          </a>

          {/* Buy key Button */}
          <a
            href="/products"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("products");
            }}
            className="flex-1 py-3 px-6 rounded-full border border-white/[0.12] bg-[#141417] hover:bg-[#1c1c20] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white flex items-center justify-center no-underline"
          >
            Buy key
          </a>
        </div>
      </main>
    </div>
  );
}

export default App;
