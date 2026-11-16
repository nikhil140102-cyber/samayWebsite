"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, ShoppingBag, Sun, Ticket, X } from "lucide-react";
import { NAV, SOCIALS } from "@/lib/site";
import { useCart, useTheme } from "@/components/common/Providers";
import SocialIcon from "@/components/common/SocialIcon";

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-9 w-9 place-items-center rounded-full border border-line hover:border-accent transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? <Moon size={15} /> : <Sun size={15} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} items`}
      className="relative grid h-9 w-9 place-items-center rounded-full border border-line hover:border-accent transition-colors"
    >
      <ShoppingBag size={15} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export default function Navbar({ logoSrc = "" }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));
  const indicator = hovered ?? NAV.find((n) => isActive(n.href))?.href;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
        <nav
          aria-label="Main"
          className={`container-x flex items-center justify-between gap-4 transition-all duration-500`}
        >
          <div
            className={`relative flex w-full items-center justify-between gap-3 rounded-full px-2.5 py-2 pl-11 transition-all duration-500 ${
              scrolled ? "glass shadow-soft" : "border border-transparent"
            }`}
          >
            {/* nimbu-mirchi charm: header height + 10px, hanging from the top of the bar */}
            <span aria-hidden="true" className="nimbu-swing pointer-events-none absolute left-3.5 top-0 h-[calc(100%+10px)] aspect-[274/718]">
              <Image src="/images/nimbu-mirchi.webp" alt="" fill sizes="30px" className="object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,.45)]" priority />
            </span>
            <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="Home">
              {logoSrc ? (
                <span className="relative h-9 w-9 shrink-0">
                  <span className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,var(--accent),transparent_40%,var(--accent))] opacity-90 blur-[1px] transition-opacity group-hover:opacity-100" />
                  {/* plain <img>: the logo may be an uploaded data URL or any https host */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoSrc} alt="Samay Raina" className="relative h-full w-full rounded-full object-cover ring-2 ring-[var(--bg)]" />
                </span>
              ) : (
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-accent text-white font-display font-bold text-sm">
                  SR
                  <span className="absolute inset-0 rounded-full bg-accent opacity-40 blur-md group-hover:opacity-80 transition-opacity" />
                </span>
              )}
              <span className="hidden sm:block font-display text-[15px] font-bold tracking-tight leading-none">
                Samay Raina
                <span className="block text-[9px] font-sora font-medium tracking-[0.25em] text-muted uppercase mt-1">
                  Fan World
                </span>
              </span>
            </Link>

            <ul className="hidden xl:flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
              {NAV.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative z-10 block px-2.5 py-1.5 text-[13px] font-medium tracking-[0.01em] transition-colors ${
                      isActive(item.href) ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {indicator === item.href && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-surface-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1.5">
              <div className="hidden 2xl:flex items-center gap-1 mr-1">
                {SOCIALS.slice(0, 3).map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-accent transition-colors"
                  >
                    <SocialIcon name={s.key} size={16} />
                  </a>
                ))}
              </div>
              <ThemeToggle />
              <CartButton />
              <span className="hidden md:block">
                <Link href="/shows" className="btn btn-primary !py-2 !px-4 !text-[12.5px] whitespace-nowrap">
                  <Ticket size={14} /> Explore Shows
                </Link>
              </span>
              <button
                className="xl:hidden grid h-9 w-9 place-items-center rounded-full border border-line"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-bg/95 backdrop-blur-xl xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="container-x flex items-center justify-between py-6">
              <span className="eyebrow">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-line"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="container-x mt-4 flex flex-col">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                  className="border-b border-line"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-4 display text-3xl sm:text-4xl ${
                      isActive(item.href) ? "text-accent" : ""
                    }`}
                  >
                    {item.label}
                    <span className="text-sm font-sora text-muted">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="container-x mt-8 flex flex-wrap items-center gap-3">
              <Link href="/shows" onClick={() => setOpen(false)} className="btn btn-primary">
                <Ticket size={16} /> Explore Shows
              </Link>
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line"
                >
                  <SocialIcon name={s.key} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
