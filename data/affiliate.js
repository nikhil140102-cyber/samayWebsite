// "Fan Picks" — Amazon Associates.
//
// Rules followed here (Amazon Associates Operating Agreement):
//  • No scraped product data, no copied Amazon images, no hard-coded prices.
//  • Links are Amazon search links carrying your associate tag, which Associates
//    allows. Swap any entry for a specific product page (/dp/ASIN) once you choose
//    the exact item — or, once your account qualifies, use the Product Advertising
//    API (Creators API) to show live images and prices.
//  • The disclosure is shown wherever these links appear.
//
// Edit through /admin → Fan Picks (MongoDB) or here.
const affiliate = [
  { slug: "podcast-microphones", category: "Microphones", name: "USB & XLR podcast microphones", description: "Mics for starting your own stream, podcast or open-mic recordings.", query: "usb podcast microphone", icon: "Mic" },
  { slug: "headphones", category: "Headphones", name: "Studio & wireless headphones", description: "Over-ear cans for editing, streaming and binge-watching specials.", query: "studio monitor headphones", icon: "Headphones" },
  { slug: "gaming-accessories", category: "Gaming accessories", name: "Gaming controllers & keyboards", description: "Gear for long gaming and streaming sessions.", query: "gaming controller", icon: "Gamepad2" },
  { slug: "cameras", category: "Cameras", name: "Vlogging cameras & webcams", description: "Cameras and webcams for creators getting started on YouTube.", query: "vlogging camera", icon: "Camera" },
  { slug: "chess-boards", category: "Chess boards", name: "Tournament chess sets", description: "Weighted pieces and roll-up boards — for every chess-stream convert.", query: "tournament chess set", icon: "Crown" },
  { slug: "chess-clocks", category: "Chess boards", name: "Digital chess clocks", description: "Practise blitz and rapid the way the streamers play it.", query: "digital chess clock", icon: "Timer" },
  { slug: "comedy-books", category: "Books", name: "Books on comedy writing", description: "Craft books for aspiring stand-up comedians and writers.", query: "stand up comedy writing book", icon: "BookOpen" },
  { slug: "chess-books", category: "Books", name: "Chess strategy books", description: "From openings to endgames — level up after the stream.", query: "chess strategy book", icon: "BookOpen" },
  { slug: "desk-setup", category: "Desk accessories", name: "Creator desk setup", description: "Monitor arms, desk mats and lights for a cleaner streaming desk.", query: "monitor arm desk setup", icon: "Lamp" },
  { slug: "ring-lights", category: "Entertainment accessories", name: "Ring lights & LED panels", description: "Soft lighting for recording sketches and reaction videos.", query: "ring light for youtube", icon: "Sun" },
];

export const AFFILIATE_CATEGORIES = [
  "Microphones",
  "Headphones",
  "Gaming accessories",
  "Cameras",
  "Chess boards",
  "Books",
  "Desk accessories",
  "Entertainment accessories",
];

export default affiliate;
