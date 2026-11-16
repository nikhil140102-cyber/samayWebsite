// Gallery seed. Only images whose reuse is permitted belong here.
//
// The entries below are YouTube's own thumbnails for official uploads, shown the
// way YouTube embeds and link previews show them, each linking back to the video
// with attribution. Replace or extend with licensed photos via /admin → Gallery
// (every image needs a `credit` and, where required, a `sourceUrl`).
const yt = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const gallery = [
  {
    slug: "still-alive-special",
    title: "Still Alive — the debut special",
    category: "Stage performances",
    src: yt("LhpZJwUboeI"),
    width: 480,
    height: 360,
    credit: "© Samay Raina — YouTube thumbnail",
    sourceUrl: "https://www.youtube.com/watch?v=LhpZJwUboeI",
  },
  {
    slug: "igl-s2-ep1",
    title: "India's Got Latent S2 — Episode 1",
    category: "YouTube appearances",
    src: yt("eHTXQW58WhA"),
    width: 480,
    height: 360,
    credit: "© Samay Raina — YouTube thumbnail",
    sourceUrl: "https://www.youtube.com/watch?v=eHTXQW58WhA",
  },
  {
    slug: "igl-s2-ep2",
    title: "India's Got Latent S2 — Episode 2",
    category: "Comedy events",
    src: yt("c35fpGWqXnk"),
    width: 480,
    height: 360,
    credit: "© Samay Raina — YouTube thumbnail",
    sourceUrl: "https://www.youtube.com/watch?v=c35fpGWqXnk",
  },
  {
    slug: "igl-s2-ep7",
    title: "India's Got Latent S2 — Episode 7",
    category: "Comedy events",
    src: yt("rkKZIMPecRA"),
    width: 480,
    height: 360,
    credit: "© Samay Raina — YouTube thumbnail",
    sourceUrl: "https://www.youtube.com/watch?v=rkKZIMPecRA",
  },
];

export const GALLERY_CATEGORIES = [
  "Stage performances",
  "Comedy events",
  "YouTube appearances",
  "Behind the scenes",
  "Public events",
];

export default gallery;
