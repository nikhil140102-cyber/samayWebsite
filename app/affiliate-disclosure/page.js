import Link from "next/link";
import LegalPage from "@/components/common/LegalPage";
import { AFFILIATE_DISCLOSURE } from "@/lib/site";

export const metadata = { title: "Affiliate Disclosure", alternates: { canonical: "/affiliate-disclosure" } };

export default function AffiliateDisclosure() {
  return (
    <LegalPage title="Affiliate Disclosure" updated="16 November 2026">
      <p><strong>{AFFILIATE_DISCLOSURE}</strong></p>
      <h2>What this means</h2>
      <p>
        Links in <Link href="/fan-picks">Fan Picks</Link> are Amazon affiliate links. If you buy through them we may earn
        a small commission, and you don&apos;t pay anything extra. Affiliate links carry <code>rel=&quot;sponsored&quot;</code>.
      </p>
      <h2>Independence</h2>
      <p>
        Fan Picks are general product categories chosen by the fan-site team. They are not endorsed, used or
        recommended by Samay Raina unless the page clearly says so with a source.
      </p>
      <h2>Prices</h2>
      <p>We don&apos;t show Amazon prices or images unless they come from Amazon&apos;s official API. Check Amazon for current pricing and availability.</p>
    </LegalPage>
  );
}
