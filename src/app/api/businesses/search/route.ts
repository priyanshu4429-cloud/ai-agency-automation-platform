import { NextRequest, NextResponse } from "next/server";

const CATEGORY_MAP: Record<string, string> = {
  restaurant: "restaurant", cafe: "cafe", bar: "bar", hospital: "hospital",
  clinic: "clinic", pharmacy: "pharmacy", school: "school", university: "university",
  hotel: "hotel", motel: "motel", gym: "gym", salon: "hair salon",
  beauty: "beauty shop", hardware: "hardware store", electrician: "electrician",
  plumber: "plumber", bakery: "bakery", butcher: "butcher", dentist: "dentist",
  bank: "bank", supermarket: "supermarket", convenience: "convenience store",
  laundry: "laundry", car_repair: "car repair", florist: "florist",
  bookstore: "book store", pet: "pet shop", furniture: "furniture store",
  electronics: "electronics shop", clothing: "clothing store", shoe: "shoe store",
  jewelry: "jewelry store", optician: "optician", travel_agency: "travel agency",
  real_estate: "real estate", lawyer: "lawyer", accountant: "accountant",
  insurance: "insurance office", advertising: "advertising agency",
};

type NominatimResult = {
  osm_id?: number;
  osm_type?: string;
  name?: string;
  display_name?: string;
  lat?: string;
  lon?: string;
  type?: string;
  category?: string;
  address?: Record<string, string>;
  extratags?: Record<string, string>;
};

type SourcePhoto = {
  url: string;
  kind: "cover" | "gallery" | "exterior" | "interior" | "product";
  evidence: "verified_source";
  source: "osm_image" | "wikimedia_commons";
  alt: string;
};

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function commonsRedirectUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (isHttpUrl(trimmed)) return trimmed;

  const fileName = (trimmed as string)
    .replace(/^File:/i, "")
    .replace(/^Category:/i, "")
    .trim();

  if (!fileName || /^Category:/i.test(trimmed)) return null;

  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
}

function extractExactSourcePhotos(
  extras: Record<string, string>,
  businessName: string
): SourcePhoto[] {
  const photos: SourcePhoto[] = [];
  const seen = new Set<string>();

  const add = (url: string | null, source: SourcePhoto["source"], kind: SourcePhoto["kind"]) => {
    if (!url || !isHttpUrl(url) || seen.has(url)) return;
    seen.add(url);
    photos.push({
      url,
      kind,
      evidence: "verified_source",
      source,
      alt: `${businessName} business photo`,
    });
  };

  add(extras.image || extras["contact:image"] || null, "osm_image", "cover");

  const commonsValues = [
    extras.wikimedia_commons,
    extras["contact:wikimedia"],
    extras["wikimedia:commons"],
  ].filter(Boolean);

  for (const value of commonsValues) {
    add(commonsRedirectUrl(value), "wikimedia_commons", photos.length ? "gallery" : "cover");
  }

  return photos.slice(0, 8);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city")?.trim();
    const category = searchParams.get("category")?.trim() || "restaurant";
    const requestedLimit = Number.parseInt(searchParams.get("limit") || "20", 10);
    const limit = Number.isNaN(requestedLimit) ? 20 : Math.min(Math.max(requestedLimit, 1), 40);

    if (!city) return NextResponse.json({ error: "City is required" }, { status: 400 });
    if (!CATEGORY_MAP[category]) {
      return NextResponse.json(
        { error: "Unsupported category", supportedCategories: Object.keys(CATEGORY_MAP) },
        { status: 400 }
      );
    }

    const query = `${CATEGORY_MAP[category]} in ${city}`;
    console.log("NOMINATIM BUSINESS SEARCH", { query, limit });

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("q", query);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("extratags", "1");
    url.searchParams.set("namedetails", "1");
    url.searchParams.set("dedupe", "1");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "AIAgencyAutomation/1.0 (business-search; contact=local-development)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Nominatim HTTP ${response.status}: ${responseText.slice(0, 300)}`);
    }

    let data: NominatimResult[];
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Nominatim returned invalid JSON: ${responseText.slice(0, 300)}`);
    }
    if (!Array.isArray(data)) throw new Error("Nominatim returned an invalid response");

    const businesses = data.map((place) => {
      const address = place.address || {};
      const extras = place.extratags || {};
      const website = extras.website || extras["contact:website"] || extras.url || null;
      const phone = extras.phone || extras["contact:phone"] || extras.mobile || extras["contact:mobile"] || null;
      const email = extras.email || extras["contact:email"] || null;
      const businessName = place.name || place.display_name?.split(",")[0] || `${category} business`;
      const sourcePhotos = extractExactSourcePhotos(extras, businessName);

      return {
        osmId: place.osm_id?.toString() || null,
        osmType: place.osm_type || null,
        businessName,
        category,
        address: place.display_name || city,
        city: address.city || address.town || address.village || address.municipality || city,
        state: address.state || null,
        country: address.country || null,
        postalCode: address.postcode || null,
        phone,
        email,
        website,
        latitude: place.lat || null,
        longitude: place.lon || null,
        hasWebsite: Boolean(website),
        media: {
          sourcePhotos,
          coverPhoto: sourcePhotos.find((photo) => photo.kind === "cover") || null,
          policy: "exact_osm_or_wikimedia_evidence_only",
        },
        tags: {
          type: place.type,
          category: place.category,
          ...extras,
        },
      };
    });

    const uniqueBusinesses = Array.from(
      new Map(businesses.map((business) => [`${business.osmType}-${business.osmId}`, business])).values()
    );

    console.log("BUSINESS SEARCH SUCCESS", {
      city,
      category,
      found: uniqueBusinesses.length,
      withExactMedia: uniqueBusinesses.filter((business) => business.media.sourcePhotos.length > 0).length,
    });

    return NextResponse.json({
      businesses: uniqueBusinesses,
      total: uniqueBusinesses.length,
      city,
      category,
      source: "OpenStreetMap / Nominatim",
      mediaPolicy: "exact OSM or Wikimedia evidence only",
    });
  } catch (error: unknown) {
    console.error("BUSINESS SEARCH ERROR:", error);
    const message = error instanceof Error ? error.message : "Unknown business search error";
    return NextResponse.json(
      { error: "Business search failed", details: message },
      { status: 500 }
    );
  }
}
