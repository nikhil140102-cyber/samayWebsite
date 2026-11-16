// District by Zomato — there is NO public District API. This module only builds and
// validates outbound links to District event pages that an admin has verified by hand.
const DISTRICT_HOSTS = ["www.district.in", "district.in", "link.district.in"];

export function isDistrictUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && DISTRICT_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

/** Adds UTM tags so the referral is visible in District's analytics, if they share them. */
export function districtBookingUrl(url) {
  if (!isDistrictUrl(url)) return "https://www.district.in/";
  const u = new URL(url);
  u.searchParams.set("utm_source", "sr-fan-world");
  u.searchParams.set("utm_medium", "referral");
  return u.toString();
}
