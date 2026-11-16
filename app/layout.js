import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/sora";
import "@fontsource-variable/playfair-display";
import "./globals.css";
import Providers from "@/components/common/Providers";
import SiteChrome from "@/components/layout/SiteChrome";
import Footer from "@/components/layout/Footer";
import fs from "node:fs";
import path from "node:path";
import { SITE } from "@/lib/site";
import { getSiteContent } from "@/lib/data";

// Logo priority: 1) uploaded in /admin → Homepage → Site logo
//                2) a file dropped into /public/images as logo.webp|png|jpg|jpeg
//                3) the red "SR" badge
const LOGO_FILE = ["logo.webp", "logo.png", "logo.jpg", "logo.jpeg"].find((f) =>
  fs.existsSync(path.join(process.cwd(), "public", "images", f))
);
async function resolveLogo() {
  const content = await getSiteContent();
  return content.logo || (LOGO_FILE ? `/images/${LOGO_FILE}` : "");
}

const baseMetadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "The World of Samay Raina — Fan Tribute",
    template: "%s · The World of Samay Raina",
  },
  description: SITE.description,
  applicationName: SITE.shortName,
  keywords: ["Samay Raina", "India's Got Latent", "Still Alive", "Samay Raina Live", "stand-up comedy", "District tickets", "chess"],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "The World of Samay Raina",
    description: SITE.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "The World of Samay Raina",
    description: SITE.description,
  },
  alternates: { canonical: "/" },
};

export async function generateMetadata() {
  const logo = await resolveLogo();
  return logo ? { ...baseMetadata, icons: { icon: logo, apple: logo } } : baseMetadata;
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#f6f4f0" },
  ],
};

// Runs before paint so the saved/system theme never flashes the wrong colours.
const themeScript = `(function(){try{var p=localStorage.getItem('theme')||'system';var d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;if(d)e.classList.add('dark');e.style.colorScheme=d?'dark':'light';}catch(_){document.documentElement.classList.add('dark')}})();`;

export default async function RootLayout({ children }) {
  const logoSrc = await resolveLogo();
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <Providers>
          <SiteChrome footer={<Footer />} logoSrc={logoSrc}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
