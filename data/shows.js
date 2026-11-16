// "Samay Raina Live" India tour 2026–27 — ticketed exclusively by District.
// Source: https://www.district.in/events/samay-raina/artist (checked 16 Nov 2026).
// District shows dates without a year; each date below was checked against its weekday.
// Prices are the "onwards" figures District displayed on that date. Availability and
// prices change — the Book Tickets button always sends fans to the live District page.
// Keep this file (or the Shows collection in MongoDB) updated via the admin dashboard.

export const VERIFIED_AT = "2026-11-16";

const shows = [
  {
    slug: "delhi-yashobhoomi",
    title: "Samay Raina Live",
    tour: "Samay Raina Live — India Tour 2026–27",
    city: "Delhi",
    venue: "Yashobhoomi",
    address: "Yashobhoomi (India International Convention & Expo Centre), Dwarka, New Delhi",
    startDate: "2026-11-15",
    endDate: "2027-02-07",
    dateLabel: "15–19 Nov 2026 & 5–7 Feb 2027 · Multiple slots",
    priceFrom: 2999,
    gatesOpen: "2:00 PM",
    status: "on-sale",
    districtUrl:
      "https://www.district.in/events/samay-raina-live-delhi-yashobhoomi-6a9bfcb5d4d3d3abd96591c9-2026-buy-tickets",
    notes: ["Pay only 50% to reserve your booking (as offered on District)"],
  },
  {
    slug: "bengaluru-koramangala-indoor-stadium",
    title: "Samay Raina Live",
    tour: "Samay Raina Live — India Tour 2026–27",
    city: "Bengaluru",
    venue: "Koramangala Indoor Stadium",
    address: "Koramangala Indoor Stadium, KHB Games Village, Koramangala, Bengaluru",
    startDate: "2027-02-12",
    endDate: "2027-02-14",
    dateLabel: "From Fri, 12 Feb 2027 · Multiple dates",
    priceFrom: 2999,
    status: "on-sale",
    districtUrl:
      "https://www.district.in/events/samay-raina-live-bengaluru-6a9c790443f5569fc694fb9a-2027-buy-tickets",
    notes: [],
  },
  {
    slug: "pune-mayfield-estate",
    title: "Samay Raina Live",
    tour: "Samay Raina Live — India Tour 2026–27",
    city: "Pune",
    venue: "Mayfield Estate",
    address: "Mayfield Estate, Dholepatil Farms Rd, Pune",
    startDate: "2027-03-04",
    endDate: "2027-03-07",
    dateLabel: "Thu, 4 Mar – Sun, 7 Mar 2027 · 7:00 PM",
    priceFrom: null,
    gatesOpen: "6:00 PM",
    status: "on-sale",
    districtUrl:
      "https://www.district.in/events/samay-raina-live-pune-mayfield-estate-6a9c22da22426beb02f84b01-2026-buy-tickets",
    notes: [
      "Entry allowed for ages 18 and above",
      "Outdoor venue with open seating (first come, first served)",
      "Pets are not allowed",
    ],
  },
  {
    slug: "mumbai-shanmukhananda",
    title: "Samay Raina Live",
    tour: "Samay Raina Live — India Tour 2026–27",
    city: "Mumbai",
    venue: "Sri Shanmukhananda Chandrasekarendra Saraswathi Auditorium",
    address: "Sri Shanmukhananda Chandrasekarendra Saraswathi Auditorium, Sion, Mumbai",
    startDate: "2027-03-11",
    endDate: "2027-03-14",
    dateLabel: "From Thu, 11 Mar 2027 · Multiple dates",
    priceFrom: 3299,
    gatesOpen: "3:00 PM",
    status: "on-sale",
    districtUrl:
      "https://www.district.in/events/samay-raina-live-mumbai-shanmukhananda-6a9c86b639e8e8d76b627847-2027-buy-tickets",
    notes: ["Pay only 50% to reserve your booking (as offered on District)"],
  },
  {
    slug: "hyderabad-gachibowli-stadium",
    title: "Samay Raina Live",
    tour: "Samay Raina Live — India Tour 2026–27",
    city: "Hyderabad",
    venue: "Gachibowli Stadium",
    address: "Gachibowli Stadium, Mushroom Rock Road, Gachibowli, Hyderabad 500032",
    startDate: "2027-03-18",
    endDate: "2027-03-21",
    dateLabel: "Thu, 18 Mar – Sun, 21 Mar 2027 · Multiple slots",
    priceFrom: 999,
    status: "on-sale",
    districtUrl:
      "https://www.district.in/events/samay-raina-live-hyderabad-6a9c7463bdf38e011c9bb534-2027-buy-tickets",
    notes: ["Open to attendees aged 18 years & above only"],
  },
  {
    slug: "delhi-ig-stadium",
    title: "Samay Raina Live",
    tour: "Samay Raina Live — India Tour 2026–27",
    city: "Delhi",
    venue: "IG Indoor Stadium",
    address: "IG Indoor Stadium, ITO, Vikram Nagar, Delhi 110002",
    startDate: "2027-03-26",
    endDate: "2027-03-28",
    dateLabel: "Fri, 26 Mar – Sun, 28 Mar 2027 · Multiple slots",
    priceFrom: 999,
    status: "on-sale",
    districtUrl:
      "https://www.district.in/events/samay-raina-live-delhi-ig-stadium-6a9bfcb70787e44a2527d027-2027-buy-tickets",
    notes: ["Pay only 50% to reserve your booking (as offered on District)"],
  },
  {
    slug: "mumbai-dome-svp-stadium",
    title: "Samay Raina Live",
    tour: "Samay Raina Live — India Tour 2026–27",
    city: "Mumbai",
    venue: "Dome SVP Stadium",
    address: "Dome, SVP Stadium (NSCI), Worli, Mumbai",
    startDate: "2027-04-01",
    endDate: "2027-04-04",
    dateLabel: "From Thu, 1 Apr 2027 · Multiple dates",
    priceFrom: 1499,
    status: "on-sale",
    districtUrl:
      "https://www.district.in/events/samay-raina-live-mumbai-nsci-dome-6a9c896e7cb96f256c9d3df6-2027-buy-tickets",
    notes: [],
  },
];

export default shows;
