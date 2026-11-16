import CheckoutClient from "@/components/merchandise/CheckoutClient";
import { checkoutEnabled } from "@/lib/payments";

export const metadata = { title: "Cart & Checkout", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <section className="container-x pt-36 pb-16 md:pt-44">
      <p className="eyebrow">Checkout</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">Your cart</h1>
      <CheckoutClient enabled={checkoutEnabled()} razorpayKey={process.env.RAZORPAY_KEY_ID || ""} />
    </section>
  );
}
