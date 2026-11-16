import LegalPage from "@/components/common/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="16 November 2026">
      <p>
        This policy explains how SR Fan World (&quot;we&quot;), an independent fan website, handles personal data. {SITE.disclaimer}
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Newsletter:</strong> your email, optional name, the time you gave consent and the consent wording.</li>
        <li><strong>Contact & fan submissions:</strong> your name, email, message, and any image link you share.</li>
        <li><strong>Orders:</strong> name, email, phone, delivery address, items and payment reference. Card and UPI details are handled by Razorpay and never reach our servers.</li>
        <li><strong>Technical:</strong> a one-way hash of your IP address for spam and abuse prevention.</li>
      </ul>
      <h2>How we use it</h2>
      <p>Only to send the newsletter you asked for, reply to you, review submissions, fulfil orders and keep the site secure. We do not sell personal data.</p>
      <h2>Third parties</h2>
      <ul>
        <li>YouTube embeds use youtube-nocookie.com. Google may still set cookies when you play a video.</li>
        <li>Razorpay processes payments under its own privacy policy.</li>
        <li>District (Zomato) handles ticket bookings after you leave this site.</li>
        <li>Amazon may set cookies when you follow Fan Picks links.</li>
      </ul>
      <h2>Your choices</h2>
      <p>You can unsubscribe at any time and ask us to access, correct or delete your data through the Contact page. We keep newsletter data until you unsubscribe, and order records for as long as tax law requires.</p>
      <h2>Storage</h2>
      <p>Your preferred theme and your cart are stored in your own browser (localStorage). They are not tracking cookies.</p>
    </LegalPage>
  );
}
