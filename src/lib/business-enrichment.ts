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
  namedetails?: Record<string, string>;
};

export type SourcePhoto = {
  url: string;
  kind: "cover" | "gallery" | "exterior" | "interior" | "product";
  evidence: "verified_source";
  source: "osm_image" | "wikimedia_commons" | "wikidata_p18";
  alt: string;
};

export type BusinessEnrichmentInput = {
  businessName: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  category?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  osmId?: string | null;
};

export type EnrichedBusiness = {
  matched: boolean;
  matchScore: number;
  matchReason: string[];
  osmId: string | null;
  osmType: string | null;
  businessName: string;
  category: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: string | null;
  longitude: string | null;
  sourcePhotos: SourcePhoto[];
  coverPhoto: SourcePhoto | null;
  sourceTags: Record<string, string>;
  source: "openstreetmap_nominatim";
};

const CATEGORY_TERMS: Record<string, string> = {
  restaurant: "restaurant",
  cafe: "cafe",
  bar: "bar",
  hospital: "hospital",
  clinic: "clinic",
  pharmacy: "pharmacy",
  school: "school",
  university: "university",
  hotel: "hotel",
  motel: "motel",
  gym: "gym",
  salon: "hair salon",
  beauty: "beauty shop",
  hardware: "hardware store",
  electrician: "electrician",
  plumber: "plumber",
  bakery: "bakery",
  butcher: "butcher",
  dentist: "dentist",
  bank: "bank",
  supermarket: "supermarket",
  convenience: "convenience store",
  laundry: "laundry",
  car_repair: "car repair",
  florist: "florist",
  bookstore: "book store",
  pet: "pet shop",
  furniture: "furniture store",
  electronics: "electronics shop",
  clothing: "clothing store",
  shoe: "shoe store",
  jewelry: "jewelry store",
  optician: "optician",
  travel_agency: "travel agency",
  real_estate: "real estate",
  lawyer: "lawyer",
  accountant: "accountant",
  insurance: "insurance office",
  advertising: "advertising agency",
};

const BUSINESS_STOP_WORDS = new Set([
  "restaurant", "restaurants", "hotel", "hotels", "cafe", "cafes",
  "shop", "store", "stores", "business", "the",
]);

function normalizeText(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstValue(
  ...values: Array<string | null | undefined>
): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function normalizePhone(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value.replace(/[^\d+]/g, "").trim();
  return cleaned || null;
}

function isHttpUrl(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function commonsRedirectUrl(rawValue: unknown): string | null {
  if (typeof rawValue !== "string" || !rawValue.trim()) return null;

  const value = rawValue.trim();
  if (isHttpUrl(value)) return value;
  if (/^Category:/i.test(value)) return null;

  const fileName = value.replace(/^File:/i, "").trim();
  if (!fileName) return null;

  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(
    fileName
  )}`;
}

function businessNameParts(value: string | null | undefined): string[] {
  const raw = value?.trim() || "";
  if (!raw) return [];

  return raw
    .split(/\s*(?:-|–|—|\||@|\bat\b)\s*/i)
    .map(normalizeText)
    .filter(Boolean);
}

function removeGenericWords(value: string): string {
  return normalizeText(value)
    .split(" ")
    .filter((word) => word.length >= 2 && !BUSINESS_STOP_WORDS.has(word))
    .join(" ")
    .trim();
}

function businessNameVariants(value: string | null | undefined): string[] {
  const normalized = normalizeText(value);
  const parts = businessNameParts(value);
  const withoutGenericWords = removeGenericWords(normalized);

  return Array.from(
    new Set([normalized, ...parts, withoutGenericWords].filter(Boolean))
  );
}

function primaryBusinessIdentity(value: string | null | undefined): string {
  const parts = businessNameParts(value);
  const firstPart = parts[0] || normalizeText(value);
  return removeGenericWords(firstPart) || firstPart;
}

function significantWords(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((word) => word.length >= 3 && !BUSINESS_STOP_WORDS.has(word));
}

function wordCoverage(expected: string, found: string): number {
  const expectedWords = significantWords(expected);
  const foundWords = new Set(significantWords(found));

  if (expectedWords.length === 0) return 0;

  return (
    expectedWords.filter((word) => foundWords.has(word)).length /
    expectedWords.length
  );
}

function getPlaceNames(place: NominatimResult): string[] {
  const names = [
    place.name,
    place.display_name?.split(",")[0],
    ...Object.values(place.namedetails || {}),
  ];

  return Array.from(
    new Set(
      names
        .filter((value): value is string => typeof value === "string")
        .map(normalizeText)
        .filter(Boolean)
    )
  );
}

function getPlaceName(place: NominatimResult): string {
  return (
    place.name?.trim() ||
    place.display_name?.split(",")[0]?.trim() ||
    ""
  );
}

function primaryIdentityMatches(
  input: BusinessEnrichmentInput,
  place: NominatimResult
): boolean {
  const primary = primaryBusinessIdentity(input.businessName);
  if (!primary) return false;

  const placeNames = getPlaceNames(place);

  return placeNames.some((name) => {
    const cleanedName = removeGenericWords(name) || name;

    if (cleanedName === primary) return true;
    if (
      primary.length >= 4 &&
      cleanedName.length >= 4 &&
      (cleanedName.includes(primary) || primary.includes(cleanedName))
    ) {
      return true;
    }

    return Math.max(
      wordCoverage(primary, cleanedName),
      wordCoverage(cleanedName, primary)
    ) >= 0.8;
  });
}

function categoryCompatible(
  inputCategory: string | null | undefined,
  place: NominatimResult
): boolean {
  const requested = normalizeText(inputCategory);
  if (!requested) return true;

  const extras = place.extratags || {};
  const evidence = normalizeText(
    [
      place.category,
      place.type,
      extras.amenity,
      extras.shop,
      extras.tourism,
      extras.office,
      extras.leisure,
      extras.healthcare,
      extras.cuisine,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const compatibility: Record<string, string[]> = {
    restaurant: ["restaurant", "food court"],
    cafe: ["cafe", "coffee shop"],
    bar: ["bar", "pub"],
    hotel: ["hotel", "guest house", "motel"],
    motel: ["motel", "hotel"],
    hospital: ["hospital"],
    clinic: ["clinic", "doctors", "healthcare"],
    pharmacy: ["pharmacy", "chemist"],
    school: ["school"],
    university: ["university", "college"],
    gym: ["fitness centre", "fitness center", "gym"],
    salon: ["hairdresser", "beauty", "salon"],
    beauty: ["beauty", "cosmetics"],
    hardware: ["hardware", "doityourself"],
    bakery: ["bakery"],
    butcher: ["butcher"],
    dentist: ["dentist"],
    bank: ["bank"],
    supermarket: ["supermarket"],
    convenience: ["convenience"],
    laundry: ["laundry", "dry cleaning"],
    car_repair: ["car repair", "car_repair"],
    florist: ["florist"],
    bookstore: ["books", "book store"],
    pet: ["pet"],
    furniture: ["furniture"],
    electronics: ["electronics"],
    clothing: ["clothes", "clothing"],
    shoe: ["shoes", "shoe"],
    jewelry: ["jewelry", "jewellery"],
    optician: ["optician"],
    travel_agency: ["travel agency"],
    real_estate: ["estate agent", "real estate"],
    lawyer: ["lawyer"],
    accountant: ["accountant"],
    insurance: ["insurance"],
    advertising: ["advertising"],
  };

  const allowed = compatibility[requested];
  if (!allowed) return true;

  return allowed.some((term) => evidence.includes(normalizeText(term)));
}

function calculateMatchScore(
  input: BusinessEnrichmentInput,
  place: NominatimResult
): { score: number; reasons: string[]; safe: boolean } {
  const reasons: string[] = [];

  // Most important safety rule:
  // "Spice Court - Hotel Maurya" must match Spice Court identity.
  // Matching only "Hotel Maurya" is not enough.
  if (!primaryIdentityMatches(input, place)) {
    return {
      score: 0,
      reasons: ["primary_business_identity_mismatch"],
      safe: false,
    };
  }

  if (!categoryCompatible(input.category, place)) {
    return {
      score: 0,
      reasons: ["category_mismatch"],
      safe: false,
    };
  }

  let score = 0;
  const expectedVariants = businessNameVariants(input.businessName);
  const foundVariants = getPlaceNames(place);
  const displayName = normalizeText(place.display_name);
  const expectedCity = normalizeText(input.city);
  const expectedState = normalizeText(input.state);
  const expectedCountry = normalizeText(input.country);

  let bestNameScore = 0;
  let bestNameReason = "";

  for (const expected of expectedVariants) {
    for (const found of foundVariants) {
      if (!expected || !found) continue;

      if (expected === found && bestNameScore < 90) {
        bestNameScore = 90;
        bestNameReason = "exact_business_name_or_alias";
        continue;
      }

      if (
        expected.length >= 4 &&
        found.length >= 4 &&
        (found.includes(expected) || expected.includes(found)) &&
        bestNameScore < 70
      ) {
        bestNameScore = 70;
        bestNameReason = "business_name_alias_match";
        continue;
      }

      const ratio = Math.max(
        wordCoverage(expected, found),
        wordCoverage(found, expected)
      );

      if (ratio >= 0.8 && bestNameScore < 60) {
        bestNameScore = 60;
        bestNameReason = "strong_business_name_words_match";
      } else if (ratio >= 0.6 && bestNameScore < 45) {
        bestNameScore = 45;
        bestNameReason = "business_name_words_match";
      }
    }
  }

  score += bestNameScore;
  if (bestNameReason) reasons.push(bestNameReason);

  if (expectedCity && displayName.includes(expectedCity)) {
    score += 25;
    reasons.push("city_match");
  }

  if (expectedState && displayName.includes(expectedState)) {
    score += 10;
    reasons.push("state_match");
  }

  if (expectedCountry && displayName.includes(expectedCountry)) {
    score += 5;
    reasons.push("country_match");
  }

  // Existing OSM id is only a bonus after identity + category safety passed.
  if (input.osmId && place.osm_id?.toString() === input.osmId) {
    score += 20;
    reasons.push("existing_osm_id_confirmed");
  }

  return {
    score,
    reasons,
    safe: bestNameScore >= 60,
  };
}

function buildSearchQueries(input: BusinessEnrichmentInput): string[] {
  const queries: string[] = [];
  const businessNames = businessNameVariants(input.businessName);
  const city = input.city?.trim();
  const state = input.state?.trim();
  const country = input.country?.trim() || "India";
  const categoryTerm =
    input.category && CATEGORY_TERMS[input.category]
      ? CATEGORY_TERMS[input.category]
      : input.category;

  for (const businessName of businessNames) {
    if (businessName && city && state) {
      queries.push(`${businessName}, ${city}, ${state}, ${country}`);
    }

    if (businessName && city) {
      queries.push(`${businessName}, ${city}, ${country}`);
    }

    if (businessName && categoryTerm && city) {
      queries.push(`${businessName} ${categoryTerm}, ${city}, ${country}`);
    }

    if (businessName && state) {
      queries.push(`${businessName}, ${state}, ${country}`);
    }
  }

  return Array.from(
    new Set(queries.map((query) => query.trim()).filter(Boolean))
  ).slice(0, 12);
}

async function searchNominatim(
  query: string,
  limit = 10
): Promise<NominatimResult[]> {
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
      "User-Agent":
        "AIAgencyAutomation/1.0 (business-enrichment; exact-entity-media)",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Nominatim HTTP ${response.status}: ${responseText.slice(0, 300)}`
    );
  }

  let data: unknown;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Nominatim invalid JSON: ${responseText.slice(0, 300)}`
    );
  }

  return Array.isArray(data) ? (data as NominatimResult[]) : [];
}

async function getWikidataP18Photo(
  wikidataId: string | null | undefined,
  businessName: string
): Promise<SourcePhoto | null> {
  const id = String(wikidataId || "").trim();

  if (!/^Q\d+$/i.test(id)) return null;

  try {
    const url = new URL(
      `https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(
        id
      )}.json`
    );

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "AIAgencyAutomation/1.0 (business-enrichment; verified-media)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data: unknown = await response.json();

    const entities = (
      data as {
        entities?: Record<
          string,
          {
            claims?: Record<
              string,
              Array<{
                mainsnak?: {
                  datavalue?: {
                    value?: unknown;
                  };
                };
              }>
            >;
          }
        >;
      }
    )?.entities;

    const rawValue =
      entities?.[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;

    if (typeof rawValue !== "string" || !rawValue.trim()) return null;

    const photoUrl = commonsRedirectUrl(`File:${rawValue.trim()}`);
    if (!photoUrl) return null;

    return {
      url: photoUrl,
      kind: "cover",
      evidence: "verified_source",
      source: "wikidata_p18",
      alt: `${businessName} verified business photo`,
    };
  } catch (error) {
    console.error("WIKIDATA P18 LOOKUP ERROR", {
      wikidataId: id,
      error,
    });

    return null;
  }
}

type CommonsSearchResponse = {
  query?: {
    search?: Array<{
      title?: string;
    }>;
  };
};

async function searchExactCommonsPhotos(
  input: BusinessEnrichmentInput,
  matchedBusinessName: string
): Promise<SourcePhoto[]> {
  const primary = primaryBusinessIdentity(input.businessName);
  const city = normalizeText(input.city);

  if (!primary) return [];

  const queryParts = [
    `"${input.businessName.trim()}"`,
    input.city?.trim(),
  ].filter(Boolean);

  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "10");
  url.searchParams.set("gsrsearch", queryParts.join(" "));

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "AIAgencyAutomation/1.0 (business-enrichment; exact-commons-media)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = (await response.json()) as CommonsSearchResponse;
    const results = data.query?.search || [];
    const photos: SourcePhoto[] = [];
    const seen = new Set<string>();

    for (const result of results) {
      const title = result.title || "";
      const normalizedTitle = normalizeText(title);
      const cleanedTitle = removeGenericWords(normalizedTitle);

      const primaryCoverage = Math.max(
        wordCoverage(primary, cleanedTitle),
        wordCoverage(cleanedTitle, primary)
      );

      // Commons fallback is intentionally strict.
      // The file title must strongly contain the primary business identity.
      if (primaryCoverage < 0.8) continue;

      // If city is explicitly present in title, it must not conflict.
      // Missing city is allowed because many Commons filenames omit city.
      const inputCityWords = significantWords(city);
      const titleHasLocationWord = inputCityWords.some((word) =>
        normalizedTitle.includes(word)
      );

      if (city && inputCityWords.length > 0 && !titleHasLocationWord) {
        const fullBusiness = normalizeText(input.businessName);
        if (!normalizedTitle.includes(fullBusiness)) continue;
      }

      const photoUrl = commonsRedirectUrl(title);
      if (!photoUrl || seen.has(photoUrl)) continue;

      seen.add(photoUrl);

      photos.push({
        url: photoUrl,
        kind: photos.length === 0 ? "cover" : "gallery",
        evidence: "verified_source",
        source: "wikimedia_commons",
        alt: `${matchedBusinessName} verified business photo`,
      });

      if (photos.length >= 5) break;
    }

    console.log("COMMONS EXACT PHOTO SEARCH", {
      requestedBusiness: input.businessName,
      primaryIdentity: primary,
      photos: photos.length,
    });

    return photos;
  } catch (error) {
    console.error("COMMONS EXACT PHOTO SEARCH ERROR", {
      businessName: input.businessName,
      error,
    });

    return [];
  }
}

async function extractSourcePhotos(
  extras: Record<string, string>,
  businessName: string,
  input: BusinessEnrichmentInput
): Promise<SourcePhoto[]> {
  const photos: SourcePhoto[] = [];
  const seen = new Set<string>();

  const addPhoto = (
    rawUrl: string | null,
    source: SourcePhoto["source"],
    kind: SourcePhoto["kind"]
  ) => {
    if (!rawUrl || !isHttpUrl(rawUrl) || seen.has(rawUrl)) return;

    seen.add(rawUrl);

    photos.push({
      url: rawUrl,
      kind,
      evidence: "verified_source",
      source,
      alt: `${businessName} business photo`,
    });
  };

  addPhoto(
    firstValue(extras.image, extras["contact:image"]),
    "osm_image",
    "cover"
  );

  const commonsValues = [
    extras.wikimedia_commons,
    extras["wikimedia:commons"],
    extras["contact:wikimedia"],
  ];

  for (const value of commonsValues) {
    addPhoto(
      commonsRedirectUrl(value),
      "wikimedia_commons",
      photos.length === 0 ? "cover" : "gallery"
    );
  }

  const wikidataPhoto = await getWikidataP18Photo(
    extras.wikidata,
    businessName
  );

  if (wikidataPhoto && !seen.has(wikidataPhoto.url)) {
    seen.add(wikidataPhoto.url);

    if (photos.some((photo) => photo.kind === "cover")) {
      wikidataPhoto.kind = "gallery";
    }

    photos.push(wikidataPhoto);
  }

  if (photos.length === 0) {
    const commonsPhotos = await searchExactCommonsPhotos(input, businessName);

    for (const photo of commonsPhotos) {
      if (seen.has(photo.url)) continue;
      seen.add(photo.url);
      photos.push(photo);
    }
  }

  return photos.slice(0, 8);
}

export async function enrichBusiness(
  input: BusinessEnrichmentInput
): Promise<EnrichedBusiness | null> {
  if (!input.businessName?.trim()) {
    throw new Error("Business name is required for enrichment");
  }

  const searchQueries = buildSearchQueries(input);
  const collectedPlaces = new Map<string, NominatimResult>();

  for (const query of searchQueries) {
    try {
      console.log("BUSINESS ENRICHMENT SEARCH", { query });

      const places = await searchNominatim(query, 10);

      for (const place of places) {
        const key = `${place.osm_type || "unknown"}-${
          place.osm_id || place.display_name
        }`;

        if (!collectedPlaces.has(key)) {
          collectedPlaces.set(key, place);
        }
      }

      if (collectedPlaces.size >= 30) break;
    } catch (error) {
      console.error("ENRICHMENT QUERY FAILED", {
        query,
        error,
      });
    }
  }

  const candidates = Array.from(collectedPlaces.values())
    .map((place) => {
      const match = calculateMatchScore(input, place);
      return {
        place,
        ...match,
      };
    })
    .filter((candidate) => candidate.safe)
    .sort((a, b) => b.score - a.score);

  const bestCandidate = candidates[0];

  if (!bestCandidate || bestCandidate.score < 60) {
    console.log("BUSINESS ENRICHMENT NO SAFE EXACT ENTITY MATCH", {
      businessName: input.businessName,
      primaryIdentity: primaryBusinessIdentity(input.businessName),
      candidateCount: candidates.length,
      bestScore: bestCandidate?.score || 0,
    });

    return null;
  }

  const place = bestCandidate.place;
  const address = place.address || {};
  const extras = place.extratags || {};
  const businessName = getPlaceName(place) || input.businessName;

  const sourcePhotos = await extractSourcePhotos(
    extras,
    businessName,
    input
  );

  const website = firstValue(
    extras.website,
    extras["contact:website"],
    extras.url
  );

  const phone = normalizePhone(
    firstValue(
      extras.phone,
      extras["contact:phone"],
      extras.mobile,
      extras["contact:mobile"]
    )
  );

  const email = firstValue(
    extras.email,
    extras["contact:email"]
  );

  const result: EnrichedBusiness = {
    matched: true,
    matchScore: bestCandidate.score,
    matchReason: bestCandidate.reasons,
    osmId: place.osm_id?.toString() || null,
    osmType: place.osm_type || null,
    businessName,
    category: input.category || place.type || null,
    address: place.display_name || null,
    city: firstValue(
      address.city,
      address.town,
      address.village,
      address.municipality,
      input.city
    ),
    state: firstValue(address.state, input.state),
    country: firstValue(address.country, input.country, "India"),
    postalCode: firstValue(address.postcode),
    phone,
    email,
    website,
    latitude: place.lat || input.latitude || null,
    longitude: place.lon || input.longitude || null,
    sourcePhotos,
    coverPhoto:
      sourcePhotos.find((photo) => photo.kind === "cover") ||
      sourcePhotos[0] ||
      null,
    sourceTags: extras,
    source: "openstreetmap_nominatim",
  };

  console.log("BUSINESS ENRICHMENT SUCCESS", {
    requestedBusiness: input.businessName,
    primaryIdentity: primaryBusinessIdentity(input.businessName),
    matchedBusiness: result.businessName,
    matchScore: result.matchScore,
    matchReason: result.matchReason,
    photos: result.sourcePhotos.length,
    photoSources: result.sourcePhotos.map((photo) => photo.source),
    wikidataId: extras.wikidata || null,
    osmId: result.osmId,
  });

  return result;
}
