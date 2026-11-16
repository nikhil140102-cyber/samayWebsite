import "server-only";
import { hasDatabase } from "./mongodb";

export const razorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

/** Checkout is only offered when payments AND order storage are both real. */
export const checkoutEnabled = () => razorpayConfigured() && hasDatabase;
