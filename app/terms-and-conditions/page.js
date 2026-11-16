import LegalPage from "@/components/common/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms-and-conditions" } };

export default function Terms() {
  return (
    <LegalPage title="Terms & Conditions" updated="16 November 2026">
      <h2>About this website</h2>
      <p>{SITE.disclaimer} It is a non-commercial tribute, apart from clearly labelled affiliate links and any licensed merchandise.</p>
      <h2>Content & intellectual property</h2>
      <p>
        Videos are embedded through YouTube&apos;s official player and remain the property of their owners. Names,
        likenesses and trademarks belong to their respective owners. Biographical information is drawn from cited
        public sources. To request a correction or removal, use the Contact page and we will act promptly.
      </p>
      <h2>Tickets</h2>
      <p>We do not sell tickets. Booking links lead to District by Zomato, whose terms govern every purchase, refund and entry rule. Dates and prices shown here are checked by hand and may change, and District&apos;s listing always takes precedence.</p>
      <h2>Membership</h2>
      <p>Channel memberships are bought and managed on YouTube. This site does not provide, resell or host members-only content.</p>
      <h2>Merchandise</h2>
      <p>Only licensed products are listed. Prices are confirmed on our server at checkout and payment is verified by Razorpay before an order is accepted. Orders are subject to availability, and we may cancel and fully refund any order we cannot fulfil.</p>
      <h2>Affiliate links</h2>
      <p>Some links earn us a commission at no cost to you. See the Affiliate Disclosure.</p>
      <h2>Liability</h2>
      <p>The site is provided &quot;as is&quot;. To the extent the law allows, we are not liable for losses arising from third-party services linked from it.</p>
    </LegalPage>
  );
}
