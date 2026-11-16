"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import CartDrawer from "@/components/merchandise/CartDrawer";
import ScrollProgress from "@/components/animations/ScrollProgress";

/** Wraps public pages with nav/footer; the admin area gets a clean canvas. */
export default function SiteChrome({ children, footer, logoSrc }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return children;
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar logoSrc={logoSrc} />
      <main id="main">{children}</main>
      {footer}
      <CartDrawer />
    </>
  );
}
