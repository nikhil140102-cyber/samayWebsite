// Fallback videos — used only when neither the YouTube Data API nor the public RSS
// feed can be reached. Every ID below was confirmed (16 Nov 2026) to be uploaded by
// the official channel "Samay Raina" (UCAov2BBv1ZJav0c_yHEciAw). No view counts are
// stored here on purpose: we never hardcode statistics.
const videos = [
  {
    id: "LhpZJwUboeI",
    title: "Samay Raina - STILL ALIVE (Full Special)",
    publishedAt: "2026-04-07T00:00:00Z",
    description: "Samay Raina's debut stand-up comedy special, Still Alive.",
    kind: "video",
    featured: true,
  },
  {
    id: "eHTXQW58WhA",
    title: "INDIA'S GOT LATENT S2 EP1 ft. Alia Bhatt, Sharvari, Ashish Solanki",
    publishedAt: "2026-06-20T13:28:06Z",
    description: "Season 2 premiere of India's Got Latent.",
    kind: "video",
    featured: true,
  },
  {
    id: "c35fpGWqXnk",
    title: "INDIA'S GOT LATENT S2 EP2 ft. Harssh Limbachiya, Kiku Sharda, Chandan Prabhakar",
    publishedAt: "2026-07-03T13:30:00Z", // premiered Fri 3 Jul 2026, 7 PM IST (Esquire India)
    description: "Episode 2 of India's Got Latent Season 2.",
    kind: "video",
    featured: true,
  },
  {
    id: "rkKZIMPecRA",
    title: "INDIA'S GOT LATENT S2 EP7 ft. Nawazuddin Siddiqui, Bhuvan Bam, Mukesh Chhabra, Kaustubh Agarwal",
    publishedAt: null, // exact upload date not confirmed — shown without a date
    description: "Episode 7 of India's Got Latent Season 2.",
    kind: "video",
    featured: false,
  },
];

export default videos;
