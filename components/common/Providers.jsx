"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";

/* ---------------- Theme ---------------- */
const ThemeCtx = createContext(null);

function applyTheme(pref) {
  const dark =
    pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  return dark;
}

function ThemeProvider({ children }) {
  const [pref, setPref] = useState("system");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    let stored = "system";
    try {
      stored = localStorage.getItem("theme") || "system";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only API, read after hydration to avoid SSR mismatch
    setPref(stored);
    setIsDark(applyTheme(stored));
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let p = "system";
      try {
        p = localStorage.getItem("theme") || "system";
      } catch {}
      if (p === "system") setIsDark(applyTheme("system"));
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next) => {
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setPref(next);
    setIsDark(applyTheme(next));
  }, []);

  const toggle = useCallback(() => setTheme(isDark ? "light" : "dark"), [isDark, setTheme]);

  const value = useMemo(() => ({ pref, isDark, setTheme, toggle }), [pref, isDark, setTheme, toggle]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

/* ---------------- Cart (persistent) ---------------- */
const CartCtx = createContext(null);
const CART_KEY = "sr-cart-v1";

const lineKey = (i) => `${i.slug}|${i.size || ""}|${i.color || ""}`;

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is browser-only; hydrate cart after mount
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const k = lineKey(item);
      const found = prev.find((p) => lineKey(p) === k);
      if (found) return prev.map((p) => (lineKey(p) === k ? { ...p, quantity: Math.min(10, p.quantity + qty) } : p));
      return [...prev, { ...item, quantity: qty }];
    });
    setOpen(true);
  }, []);

  const update = useCallback((key, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((p) => lineKey(p) !== key)
        : prev.map((p) => (lineKey(p) === key ? { ...p, quantity: Math.min(10, quantity) } : p))
    );
  }, []);

  const remove = useCallback((key) => setItems((prev) => prev.filter((p) => lineKey(p) !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  const value = useMemo(
    () => ({ items, add, update, remove, clear, count, subtotal, open, setOpen, lineKey, ready }),
    [items, add, update, remove, clear, count, subtotal, open, ready]
  );
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);

/* ---------------- Root ---------------- */
export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </CartProvider>
    </ThemeProvider>
  );
}
