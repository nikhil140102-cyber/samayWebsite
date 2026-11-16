// Biography timeline. Every entry is sourced; nothing is invented.
export const SOURCES = {
  wiki: { label: "Wikipedia — Samay Raina", url: "https://en.wikipedia.org/wiki/Samay_Raina" },
  wikiIgl: { label: "Wikipedia — India's Got Latent", url: "https://en.wikipedia.org/wiki/India%27s_Got_Latent" },
  chessbase: { label: "ChessBase India", url: "https://aagaard.chessbase.in/news/Samay-Raina-quits-stand-up-comedy" },
  deadant: { label: "DeadAnt (Nov 2020)", url: "https://deadant.co/samay-raina-the-standup-comic-who-became-the-face-of-chess-streaming-in-india/" },
  thr: { label: "The Hollywood Reporter India", url: "https://www.hollywoodreporterindia.com/features/insight/why-do-men-find-comfort-in-samay-rainas-indias-got-latent" },
  stillAlive: { label: "YouTube — STILL ALIVE (Full Special)", url: "https://www.youtube.com/watch?v=LhpZJwUboeI" },
  fpj: { label: "Free Press Journal", url: "https://www.freepressjournal.in/entertainment/samay-rainas-still-alive-becomes-most-watched-youtube-comedy-special-globally" },
  igl2: { label: "YouTube — India's Got Latent S2 EP1", url: "https://www.youtube.com/watch?v=eHTXQW58WhA" },
  hans: { label: "The Hans India", url: "https://www.thehansindia.com/featured/sunday-hans/samay-raina-live-india-tour-2026-27-announces-biggest-tour-1126068" },
  eventfaqs: { label: "EventFAQs", url: "https://in.eventfaqs.com/2026/09/30/samay-raina-live-pre-sale-sells-over-1-lakh-tickets-in-under-an-hour/" },
  district: { label: "District — Samay Raina", url: "https://www.district.in/events/samay-raina/artist" },
};

export const milestones = [
  {
    year: "1997",
    title: "Born in Jammu",
    text: "Samay Raina was born on 26 October 1997 in Jammu, and later studied engineering at PVG's College of Engineering in Pune.",
    sources: ["wiki"],
  },
  {
    year: "2017",
    title: "The first open mics",
    text: "He began performing at open mics in August 2017, opening for comedians such as Abhishek Upmanyu and Anirban Dasgupta in his early years.",
    sources: ["wiki", "chessbase"],
  },
  {
    year: "2019",
    title: "Comicstaan Season 2",
    text: "Joined Comicstaan Season 2 on Amazon Prime Video and became its joint winner alongside Aakash Gupta.",
    sources: ["wiki"],
  },
  {
    year: "2020",
    title: "Chess goes mainstream",
    text: "With live shows cancelled during the pandemic, he started streaming chess on YouTube at Tanmay Bhat's suggestion — bringing in grandmasters like Vidit Gujrathi, creators like agadmator, and the Comedians on Board tournaments.",
    sources: ["wiki", "deadant"],
  },
  {
    year: "2021",
    title: "Comedy Premium League",
    text: "Was on the winning side of Netflix's Comedy Premium League and mentored on Amazon Prime Video's One Mic Stand Season 2.",
    sources: ["wiki"],
  },
  {
    year: "2024",
    title: "India's Got Latent",
    text: "Launched India's Got Latent on his YouTube channel on 14 June 2024 — a comedy talent show inspired by Kill Tony and the Got Talent format.",
    sources: ["wikiIgl", "thr"],
  },
  {
    year: "2025",
    title: "A step back",
    text: "On 12 February 2025, following a controversy over a guest's remarks, he made all India's Got Latent episodes private and stepped away from the platform.",
    sources: ["wikiIgl"],
  },
  {
    year: "2026",
    title: "Still Alive",
    text: "Returned on 7 April 2026 with his debut stand-up special, Still Alive, on YouTube — reported to have become the most-watched comedy special on YouTube.",
    sources: ["stillAlive", "fpj"],
  },
  {
    year: "2026",
    title: "Latent, Season 2",
    text: "India's Got Latent returned on 20 June 2026, premiering on both YouTube and Netflix.",
    sources: ["igl2", "wikiIgl"],
  },
  {
    year: "2026–27",
    title: "Samay Raina Live",
    text: "His biggest India tour yet runs November 2026 to April 2027, ticketed exclusively by District. The pre-sale was reported to have sold over one lakh tickets in under an hour.",
    sources: ["hans", "eventfaqs", "district"],
  },
];
