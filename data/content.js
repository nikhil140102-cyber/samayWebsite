// Editable homepage copy. Overridden by the SiteContent document in MongoDB
// (admin → Homepage) when a database is connected.
const content = {
  heroHeading: "THE WORLD OF SAMAY RAINA",
  heroSubheading: "Comedy. Chaos. Creativity. Unfiltered Entertainment.",
  heroText: "Explore the journey, performances, shows and entertainment of Samay Raina.",
  logo: "", // set from /admin → Homepage → Site logo (or drop public/images/logo.webp|png|jpg)
  heroImage: "", // optional — a licensed portrait URL. Leave blank to show the 3D stage.
  heroImageCredit: "",
  announcement: "Samay Raina Live — India Tour 2026–27 · Tickets exclusively on District",
};

export default content;
