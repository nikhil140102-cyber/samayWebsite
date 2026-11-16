// Merchandise catalogue.
//
// This list is intentionally EMPTY. No officially authorised Samay Raina merchandise
// supplier has been confirmed for this fan project, and the brief forbids selling
// unauthorised products that use his name, face, signature or branding.
//
// When licensed products exist, add them through /admin → Merchandise (stored in
// MongoDB) or append objects here in this shape:
//
// {
//   slug: "still-alive-tee",
//   name: "Still Alive Tee",
//   category: "T-shirts",           // T-shirts | Hoodies | Caps | Posters | Collectibles | Accessories | Fan merchandise
//   price: 1299,                     // INR, whole rupees
//   description: "…",
//   images: ["https://…/front.jpg", "https://…/back.jpg"],
//   sizes: ["S", "M", "L", "XL"],
//   colors: ["Black", "Off-white"],
//   shipping: "Ships in 5–7 working days across India.",
//   stock: 50,
//   purchasable: true,               // false → shows an external "View" link instead of Add to Cart
//   externalUrl: "",                 // licensed third-party store link, if any
//   licenseNote: "Officially licensed by …",
// }
// CONCEPT DESIGNS — original mockups generated for this demo (Magnific), inspired
// by public motifs from the channel and shows. They are NOT for sale: `concept: true`
// hides prices and checkout and labels them clearly. Replace with licensed
// products (concept: false, real price, licenseNote) when an official line exists.
const img = (k) => `/images/merch/${k}.webp`;
const products = [
  {
    slug: "still-alive-tee",
    name: "Still Alive Tee",
    category: "T-shirts",
    concept: true,
    description: "Heavyweight black oversized tee with a distressed red “STILL ALIVE” chest print, a nod to the 2026 debut special.",
    images: [img("still-alive-tee")],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
  },
  {
    slug: "nazar-na-lage-tee",
    name: "Nazar Na Lage Tee",
    category: "T-shirts",
    concept: true,
    description: "Off-white oversized tee with a screen-printed nimbu-mirchi charm, for protection from every evil eye in the comments.",
    images: [img("nazar-na-lage-tee")],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Off-white"],
  },
  {
    slug: "blunder-master-hoodie",
    name: "Blunder Master Hoodie",
    category: "Hoodies",
    concept: true,
    description: "Black heavyweight hoodie with a red pawn and “BLUNDER MASTER”, for everyone who learned chess from the streams.",
    images: [img("blunder-master-hoodie")],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
  },
  {
    slug: "red-check-overshirt",
    name: "Red Check Overshirt",
    category: "Fan merchandise",
    concept: true,
    description: "A red-and-black buffalo-check flannel overshirt inspired by the signature stage shirt.",
    images: [img("red-check-overshirt")],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red / Black"],
  },
  {
    slug: "sr-monogram-cap",
    name: "SR Monogram Cap",
    category: "Caps",
    concept: true,
    description: "Six-panel black cap with a raised red “SR” embroidered monogram.",
    images: [img("sr-monogram-cap")],
    sizes: ["One size"],
    colors: ["Black"],
  },
  {
    slug: "live-tour-poster",
    name: "Live Tour Poster",
    category: "Posters",
    concept: true,
    description: "Typographic “Samay Raina Live — India Tour 2026–27” gig poster in a black frame.",
    images: [img("live-tour-poster")],
    sizes: ["A3", "A2"],
    colors: ["Black frame"],
  },
];

export const PRODUCT_CATEGORIES = [
  "T-shirts",
  "Hoodies",
  "Caps",
  "Posters",
  "Collectibles",
  "Accessories",
  "Fan merchandise",
];

export default products;
