// Integration status without leaking any secret values.
import { hasDatabase } from "@/lib/mongodb";
import { authConfigured } from "@/lib/auth";
import { razorpayConfigured } from "@/lib/payments";
import { hasAssociateTag } from "@/lib/amazon";
import { youtubeStatus } from "@/lib/youtube";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  return json({
    ok: true,
    integrations: {
      mongodb: hasDatabase,
      adminAuth: authConfigured(),
      youtubeApi: youtubeStatus().apiKey,
      youtubeRssFallback: true,
      razorpay: razorpayConfigured(),
      razorpayWebhook: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
      amazonAssociateTag: hasAssociateTag,
      district: "manual verified links (no public API)",
    },
  });
}
