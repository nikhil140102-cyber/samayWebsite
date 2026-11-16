// Central site configuration. Every external link here was verified on 16 Nov 2026.
export const SITE = {
  name: "The World of Samay Raina",
  shortName: "SR Fan World",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "An independent, fan-made tribute to Samay Raina — stand-up comedy, YouTube, India's Got Latent, chess and the Samay Raina Live India tour.",
  disclaimer:
    "Independent fan-made tribute. Not officially affiliated with, endorsed by, or managed by Samay Raina or his team.",
  youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || "UCAov2BBv1ZJav0c_yHEciAw",
};

export const LINKS = {
  youtube: "https://www.youtube.com/@SamayRainaOfficial",
  youtubeJoin: "https://www.youtube.com/channel/UCAov2BBv1ZJav0c_yHEciAw/join",
  youtubeShorts: "https://www.youtube.com/@SamayRainaOfficial/shorts",
  youtubePlaylists: "https://www.youtube.com/@SamayRainaOfficial/playlists",
  instagram: "https://www.instagram.com/maisamayhoon/",
  x: "https://x.com/ReheSamay",
  discord: "https://discord.gg/maisamayhoon",
  officialSite: "https://samayraina.co",
  audienceApply: "https://samayraina.co/apply/audience",
  iglYoutube: "https://www.youtube.com/@IndiasGotLatentOfficial",
  iglInstagram: "https://www.instagram.com/indiasgotlatent/",
  district: "https://www.district.in/",
  districtArtist: "https://www.district.in/events/samay-raina/artist",
  chess: "https://www.chess.com/member/samayraina",
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/videos", label: "Videos" },
  { href: "/shows", label: "Shows" },
  { href: "/membership", label: "Membership" },
  { href: "/merchandise", label: "Merchandise" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const SOCIALS = [
  { key: "youtube", label: "YouTube", href: LINKS.youtube },
  { key: "instagram", label: "Instagram", href: LINKS.instagram },
  { key: "x", label: "X", href: LINKS.x },
  { key: "discord", label: "Discord", href: LINKS.discord },
];

export const AFFILIATE_DISCLOSURE =
  "As an Amazon Associate, this website may earn from qualifying purchases.";
