import { NextRequest, NextResponse } from "next/server";

const CATEGORY_MAP: Record<string, string> = {
  restaurant: "amenity=restaurant", 
  cafe: "amenity=cafe", 
  bar: "amenity=bar", 
  hospital: "amenity=hospital",
  clinic: "amenity=clinic", 
  pharmacy: "amenity=pharmacy", 
  school: "amenity=school", 
  university: "amenity=university",
  hotel: "tourism=hotel", 
  motel: "tourism=motel", 
  gym: "leisure=fitness_centre", 
  salon: "shop=hairdresser",
  beauty: "shop=beauty", 
  hardware: "shop=hardware", 
  electrician: "craft=electrician",
  plumber: "craft=plumber", 
  bakery: "shop=bakery", 
  butcher: "shop=butcher", 
  dentist: "amenity=dentist",
  bank: "amenity=bank", 
  supermarket: "shop=supermarket", 
  convenience: "shop=convenience",
  laundry: "shop=laundry", 
  car_repair: "shop=car_repair", 
  florist: "shop=florist",
  bookstore: "shop=books", 
  pet: "shop=pet", 
  furniture: "shop=furniture",
  electronics: "shop=electronics", 
  clothing: "shop=clothes", 
  shoe: "shop=shoes",
  jewelry: "shop=jewelry", 
  optician: "shop=optician", 
  travel_agency: "shop=travel_agency",
  real_estate: "office=estate_agent", 
  lawyer: "office=lawyer", 
  accountant: "office=accountant",
  insurance: "office=insurance", 
  advertising: "office=advertising_agency",
};

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
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
    const requestedLimit = Number.parseInt(searchParams.get("limit") || "100", 10);
    const limit = Number.isNaN(requestedLimit) ? 100 : Math.min(Math.max(requestedLimit, 1), 200);

    if (!city) return NextResponse.json({ error: "City is required" }, { status: 400 });
    
    // Default to amenity if category is not explicitly mapped
    const osmTag = CATEGORY_MAP[category] || `amenity=${category}`;
    const [tagKey, tagValue] = osmTag.split("=");

    console.log("OVERPASS BUSINESS SEARCH", { city, category, tagKey, tagValue, limit });

    // Build Overpass API query
    const overpassQuery = `
      [out:json][timeout:25];
      area[name="${city}"]->.searchArea;
      (
        node["${tagKey}"="${tagValue}"](area.searchArea);
        way["${tagKey}"="${tagValue}"](area.searchArea);
        relation["${tagKey}"="${tagValue}"](area.searchArea);
      );
      out center ${limit};
      out tags;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "AIAgencyAutomation/1.0 (business-search)",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
      cache: "no-store",
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Overpass HTTP ${response.status}: ${responseText.slice(0, 300)}`);
    }

    let data: { elements?: OverpassElement[] };
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Overpass returned invalid JSON: ${responseText.slice(0, 300)}`);
    }
    
    if (!data.elements || !Array.isArray(data.elements)) {
      throw new Error("Overpass returned an invalid response structure");
    }

    const businesses = data.elements
      .filter((el) => el.tags && el.tags.name) // Only include businesses with a name
      .map((el) => {
        const tags = el.tags || {};
        const website = tags.website || tags["contact:website"] || tags.url || null;
        const phone = tags.phone || tags["contact:phone"] || tags.mobile || tags["contact:mobile"] || null;
        const email = tags.email || tags["contact:email"] || null;
        const businessName = tags.name || `${category} business`;
        
        const sourcePhotos = extractExactSourcePhotos(tags, businessName);
        
        // Try to construct an address
        const street = tags["addr:street"] || "";
        const housenumber = tags["addr:housenumber"] || "";
        const cityTag = tags["addr:city"] || city;
        const addressString = [housenumber, street, cityTag].filter(Boolean).join(" ") || cityTag;

        const lat = el.lat || el.center?.lat || null;
        const lon = el.lon || el.center?.lon || null;

        return {
          osmId: el.id.toString(),
          osmType: el.type,
          businessName,
          category,
          address: addressString,
          city: cityTag,
          state: tags["addr:state"] || null,
          country: tags["addr:country"] || null,
          postalCode: tags["addr:postcode"] || null,
          phone,
          email,
          website,
          latitude: lat?.toString() || null,
          longitude: lon?.toString() || null,
          hasWebsite: Boolean(website),
          media: {
            sourcePhotos,
            coverPhoto: sourcePhotos.find((photo) => photo.kind === "cover") || null,
            policy: "exact_osm_or_wikimedia_evidence_only",
          },
          tags,
        };
      });

    // Remove exact duplicates
    const uniqueBusinesses = Array.from(
      new Map(businesses.map((business) => [`${business.osmType}-${business.osmId}`, business])).values()
    );

    console.log("OVERPASS SEARCH SUCCESS", {
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
      source: "OpenStreetMap / Overpass API",
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
