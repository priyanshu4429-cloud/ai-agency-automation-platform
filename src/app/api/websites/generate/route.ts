import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { websites, leads, activities } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { eq, desc } from "drizzle-orm";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";

type ServiceItem = {
  title: string;
  description: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

function cleanCategory(category: string) {
  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getBusinessDescription(lead: any) {
  const metadata = lead.metadata as Record<string, any> | null;

  return (
    metadata?.businessDescription ||
    `${lead.businessName} is a local ${cleanCategory(
      lead.category
    ).toLowerCase()} business serving customers in ${
      lead.city || "the local community"
    }.`
  );
}

function getWhatsApp(lead: any) {
  const metadata = lead.metadata as Record<string, any> | null;

  return metadata?.whatsapp || lead.phone || null;
}

function getCategoryConfig(category: string) {
  const normalizedCategory = category.toLowerCase();

  const configs: Record<
    string,
    {
      primary: string;
      secondary: string;
      accent: string;
      dark: string;
      light: string;
      eyebrow: string;
      cta: string;
      services: ServiceItem[];
    }
  > = {
    restaurant: {
      primary: "#ef4444",
      secondary: "#f97316",
      accent: "#fbbf24",
      dark: "#180b0b",
      light: "#fff7ed",
      eyebrow: "Local flavours. Memorable moments.",
      cta: "Contact Us",
      services: [
        {
          title: "Freshly Prepared Food",
          description:
            "Enjoy freshly prepared dishes made with attention to taste and quality.",
        },
        {
          title: "Family Dining",
          description:
            "A welcoming dining experience for families, friends and local guests.",
        },
        {
          title: "Local Favourites",
          description:
            "Popular food choices prepared for the tastes of our local community.",
        },
        {
          title: "Group Orders",
          description:
            "Contact the restaurant for group dining and larger food requirements.",
        },
        {
          title: "Customer Service",
          description:
            "Friendly assistance for enquiries, orders and dining information.",
        },
        {
          title: "Easy Contact",
          description:
            "Reach the restaurant directly by phone or WhatsApp.",
        },
      ],
    },

    bakery: {
      primary: "#d97706",
      secondary: "#f59e0b",
      accent: "#fcd34d",
      dark: "#1c1208",
      light: "#fffbeb",
      eyebrow: "Freshly baked. Made with care.",
      cta: "Contact Bakery",
      services: [
        {
          title: "Fresh Bakery Products",
          description:
            "Freshly prepared bakery products for everyday customers.",
        },
        {
          title: "Cakes & Celebrations",
          description:
            "Contact us for cake and celebration requirements.",
        },
        {
          title: "Snacks & Treats",
          description:
            "A selection of bakery snacks and sweet treats.",
        },
        {
          title: "Custom Enquiries",
          description:
            "Discuss your specific bakery requirements directly with us.",
        },
        {
          title: "Local Service",
          description:
            "Serving customers from the local area with care.",
        },
        {
          title: "Direct Contact",
          description:
            "Call or WhatsApp for product and availability enquiries.",
        },
      ],
    },

    hardware: {
      primary: "#f97316",
      secondary: "#64748b",
      accent: "#fbbf24",
      dark: "#111827",
      light: "#f8fafc",
      eyebrow: "Reliable products for everyday requirements.",
      cta: "Get In Touch",
      services: [
        {
          title: "Hardware Products",
          description:
            "Practical hardware products for local customers and businesses.",
        },
        {
          title: "Product Enquiries",
          description:
            "Contact the business to check product availability and requirements.",
        },
        {
          title: "Trading Support",
          description:
            "Reliable assistance for general trading and product enquiries.",
        },
        {
          title: "Local Supply",
          description:
            "Serving customers and businesses in the local market.",
        },
        {
          title: "Customer Assistance",
          description:
            "Direct support for questions about available products.",
        },
        {
          title: "Easy Communication",
          description:
            "Connect directly by phone or WhatsApp for more information.",
        },
      ],
    },

    electronics: {
      primary: "#2563eb",
      secondary: "#06b6d4",
      accent: "#8b5cf6",
      dark: "#020617",
      light: "#f8fafc",
      eyebrow: "Technology for modern everyday life.",
      cta: "Contact Store",
      services: [
        {
          title: "Electronic Products",
          description:
            "Explore electronic products based on your everyday requirements.",
        },
        {
          title: "Product Enquiries",
          description:
            "Ask about product availability and specifications.",
        },
        {
          title: "Customer Assistance",
          description:
            "Get direct assistance for general product questions.",
        },
        {
          title: "Local Service",
          description:
            "Serving customers from the local area.",
        },
        {
          title: "Business Enquiries",
          description:
            "Contact us directly for larger or business requirements.",
        },
        {
          title: "Direct Communication",
          description:
            "Call or WhatsApp for current product information.",
        },
      ],
    },
  };

  return (
    configs[normalizedCategory] || {
      primary: "#2563eb",
      secondary: "#7c3aed",
      accent: "#06b6d4",
      dark: "#020617",
      light: "#f8fafc",
      eyebrow: "Local business. Modern experience.",
      cta: "Contact Us",
      services: [
        {
          title: "Professional Service",
          description:
            "Reliable service focused on customer requirements.",
        },
        {
          title: "Customer Assistance",
          description:
            "Direct assistance for business and service enquiries.",
        },
        {
          title: "Local Expertise",
          description:
            "Serving customers from the local community.",
        },
        {
          title: "Business Enquiries",
          description:
            "Contact the business to discuss your requirements.",
        },
        {
          title: "Reliable Communication",
          description:
            "Stay connected directly by phone or WhatsApp.",
        },
        {
          title: "Personal Support",
          description:
            "Get help based on your individual requirements.",
        },
      ],
    }
  );
}


type LayoutProfile = {
  layoutStyle: "editorial" | "showcase" | "compact";
  heroVariant: "split" | "centered" | "offset";
  servicesVariant: "grid" | "featured" | "compact";
  visualDensity: "airy" | "balanced" | "dense";
};

function classifyBusiness(lead: any, description: string) {
  const source = `${lead.businessName || ""} ${lead.category || ""} ${description || ""}`.toLowerCase();

  const rules: Array<{ type: string; name: string; patterns: RegExp[] }> = [
    { type: "indian_sweets_shop", name: "Indian Sweets Shop", patterns: [/\bmithai\b/, /\bmisthan\b/, /\bsweet shop\b/, /\bsweets?\b/, /\bconfectionery\b/] },
    { type: "agricultural_trader", name: "Agricultural Products & Trading", patterns: [/\bagricultur/, /\bfarm products?\b/, /\bagri\b/, /\bseeds?\b/, /\bfertilizer\b/] },
    { type: "bakery", name: "Bakery", patterns: [/\bbakery\b/, /\bbaked goods?\b/, /\bcakes?\b/] },
    { type: "restaurant", name: "Restaurant", patterns: [/\brestaurant\b/, /\bdhaba\b/, /\bdining\b/] },
    { type: "cafe", name: "Cafe", patterns: [/\bcafe\b/, /\bcoffee shop\b/] },
    { type: "bar", name: "Bar", patterns: [/\bbar\b/, /\bpub\b/] },
    { type: "hotel", name: "Hotel", patterns: [/\bhotel\b/, /\bmotel\b/, /\blodging\b/, /\bguest house\b/] },
    { type: "hospital", name: "Hospital", patterns: [/\bhospital\b/] },
    { type: "clinic", name: "Clinic", patterns: [/\bclinic\b/, /\bmedical centre\b/, /\bmedical center\b/] },
    { type: "pharmacy", name: "Pharmacy", patterns: [/\bpharmacy\b/, /\bchemist\b/, /\bmedical store\b/] },
    { type: "dentist", name: "Dental Clinic", patterns: [/\bdentist\b/, /\bdental\b/] },
    { type: "salon", name: "Salon", patterns: [/\bsalon\b/, /\bhair\b/, /\bbeauty parlou?r\b/, /\bbeauty shop\b/] },
    { type: "gym", name: "Gym & Fitness", patterns: [/\bgym\b/, /\bfitness\b/] },
    { type: "hardware_trader", name: "Hardware & Trading", patterns: [/\bhardware\b/, /\btools?\b/, /\bbuilding material\b/] },
    { type: "electronics_store", name: "Electronics Store", patterns: [/\belectronics?\b/, /\bmobile\b/, /\bcomputer\b/, /\blaptop\b/] },
    { type: "electrician", name: "Electrical Services", patterns: [/\belectrician\b/, /\belectrical service\b/] },
    { type: "plumber", name: "Plumbing Services", patterns: [/\bplumber\b/, /\bplumbing\b/] },
    { type: "car_repair", name: "Auto Repair", patterns: [/\bcar repair\b/, /\bauto repair\b/, /\bgarage\b/, /\bmechanic\b/] },
    { type: "school", name: "School", patterns: [/\bschool\b/] },
    { type: "university", name: "University", patterns: [/\buniversity\b/, /\bcollege\b/] },
    { type: "bank", name: "Banking Services", patterns: [/\bbank\b/, /\bbanking\b/] },
    { type: "supermarket", name: "Supermarket", patterns: [/\bsupermarket\b/, /\bgrocery\b/] },
    { type: "convenience", name: "Convenience Store", patterns: [/\bconvenience\b/, /\bgeneral store\b/] },
    { type: "laundry", name: "Laundry Services", patterns: [/\blaundry\b/, /\bdry clean\b/] },
    { type: "florist", name: "Florist", patterns: [/\bflorist\b/, /\bflower shop\b/] },
    { type: "bookstore", name: "Book Store", patterns: [/\bbook ?store\b/, /\bbooks?\b/] },
    { type: "pet", name: "Pet Shop", patterns: [/\bpet shop\b/, /\bpet store\b/] },
    { type: "furniture", name: "Furniture Store", patterns: [/\bfurniture\b/] },
    { type: "clothing", name: "Clothing Store", patterns: [/\bclothing\b/, /\bgarments?\b/, /\bfashion\b/] },
    { type: "shoe", name: "Footwear Store", patterns: [/\bshoe\b/, /\bfootwear\b/] },
    { type: "jewelry", name: "Jewellery Store", patterns: [/\bjewel/, /\bjewellery\b/, /\bjewelry\b/] },
    { type: "optician", name: "Optician", patterns: [/\boptician\b/, /\boptical\b/, /\beyewear\b/] },
    { type: "travel_agency", name: "Travel Agency", patterns: [/\btravel agency\b/, /\btours?\b/, /\btravels?\b/] },
    { type: "real_estate", name: "Real Estate", patterns: [/\breal estate\b/, /\bproperty\b/] },
    { type: "lawyer", name: "Legal Services", patterns: [/\blawyer\b/, /\badvocate\b/, /\blegal\b/] },
    { type: "accountant", name: "Accounting Services", patterns: [/\baccountant\b/, /\baccounting\b/, /\bchartered accountant\b/] },
    { type: "insurance", name: "Insurance Services", patterns: [/\binsurance\b/] },
    { type: "advertising", name: "Advertising Agency", patterns: [/\badvertising\b/, /\bmarketing agency\b/] },
    { type: "butcher", name: "Butcher Shop", patterns: [/\bbutcher\b/, /\bmeat shop\b/] },
  ];

  // Description/name evidence wins over a noisy imported category.
  for (const rule of rules) {
    if (rule.patterns.some((pattern) => pattern.test(source))) {
      return { businessType: rule.type, categoryName: rule.name };
    }
  }

  const fallback = String(lead.category || "local_business").toLowerCase().replace(/\s+/g, "_");
  return { businessType: fallback, categoryName: cleanCategory(fallback) };
}

function getLayoutProfile(businessType: string): LayoutProfile {
  const profiles: Record<string, LayoutProfile> = {
    indian_sweets_shop: { layoutStyle: "showcase", heroVariant: "split", servicesVariant: "grid", visualDensity: "airy" },
    bakery: { layoutStyle: "showcase", heroVariant: "centered", servicesVariant: "featured", visualDensity: "airy" },
    restaurant: { layoutStyle: "showcase", heroVariant: "centered", servicesVariant: "featured", visualDensity: "airy" },
    cafe: { layoutStyle: "editorial", heroVariant: "offset", servicesVariant: "grid", visualDensity: "airy" },
    bar: { layoutStyle: "editorial", heroVariant: "centered", servicesVariant: "featured", visualDensity: "dense" },
    agricultural_trader: { layoutStyle: "compact", heroVariant: "offset", servicesVariant: "compact", visualDensity: "dense" },
    hardware_trader: { layoutStyle: "compact", heroVariant: "offset", servicesVariant: "compact", visualDensity: "dense" },
    electronics_store: { layoutStyle: "showcase", heroVariant: "offset", servicesVariant: "grid", visualDensity: "balanced" },
    salon: { layoutStyle: "editorial", heroVariant: "centered", servicesVariant: "featured", visualDensity: "airy" },
    gym: { layoutStyle: "compact", heroVariant: "offset", servicesVariant: "featured", visualDensity: "dense" },
    hotel: { layoutStyle: "showcase", heroVariant: "centered", servicesVariant: "grid", visualDensity: "airy" },
    hospital: { layoutStyle: "compact", heroVariant: "split", servicesVariant: "grid", visualDensity: "balanced" },
    clinic: { layoutStyle: "compact", heroVariant: "split", servicesVariant: "featured", visualDensity: "balanced" },
    pharmacy: { layoutStyle: "compact", heroVariant: "split", servicesVariant: "compact", visualDensity: "dense" },
    dentist: { layoutStyle: "editorial", heroVariant: "split", servicesVariant: "featured", visualDensity: "airy" },
    school: { layoutStyle: "editorial", heroVariant: "centered", servicesVariant: "grid", visualDensity: "airy" },
    university: { layoutStyle: "editorial", heroVariant: "centered", servicesVariant: "grid", visualDensity: "airy" },
    clothing: { layoutStyle: "showcase", heroVariant: "centered", servicesVariant: "featured", visualDensity: "airy" },
    shoe: { layoutStyle: "showcase", heroVariant: "offset", servicesVariant: "grid", visualDensity: "balanced" },
    jewelry: { layoutStyle: "editorial", heroVariant: "centered", servicesVariant: "featured", visualDensity: "airy" },
    furniture: { layoutStyle: "editorial", heroVariant: "offset", servicesVariant: "grid", visualDensity: "airy" },
    florist: { layoutStyle: "showcase", heroVariant: "centered", servicesVariant: "featured", visualDensity: "airy" },
    car_repair: { layoutStyle: "compact", heroVariant: "offset", servicesVariant: "compact", visualDensity: "dense" },
    electrician: { layoutStyle: "compact", heroVariant: "offset", servicesVariant: "compact", visualDensity: "dense" },
    plumber: { layoutStyle: "compact", heroVariant: "offset", servicesVariant: "compact", visualDensity: "dense" },
    travel_agency: { layoutStyle: "showcase", heroVariant: "centered", servicesVariant: "grid", visualDensity: "airy" },
    real_estate: { layoutStyle: "editorial", heroVariant: "offset", servicesVariant: "featured", visualDensity: "airy" },
    lawyer: { layoutStyle: "editorial", heroVariant: "split", servicesVariant: "featured", visualDensity: "balanced" },
    accountant: { layoutStyle: "compact", heroVariant: "split", servicesVariant: "grid", visualDensity: "balanced" },
    insurance: { layoutStyle: "compact", heroVariant: "split", servicesVariant: "grid", visualDensity: "balanced" },
    advertising: { layoutStyle: "showcase", heroVariant: "offset", servicesVariant: "featured", visualDensity: "balanced" },
  };

  return profiles[businessType] || {
    layoutStyle: "showcase",
    heroVariant: "split",
    servicesVariant: "grid",
    visualDensity: "balanced",
  };
}


type MediaAsset = {
  url: string;
  kind: "logo" | "cover" | "gallery" | "product" | "interior" | "exterior";
  evidence: "business_provided" | "verified_source" | "demo_stock";
  alt: string;
};

type CanonicalBusinessProfile = {
  businessType: string;
  categoryName: string;
  importedCategory: string;
  description: string;
  confirmedCapabilities: string[];
  media: MediaAsset[];
  layoutFamily:
    | "food_product"
    | "retail_showcase"
    | "professional_trust"
    | "service_action"
    | "hospitality_experience"
    | "healthcare_clarity"
    | "education_institution"
    | "trade_industrial";
};

function getLayoutFamily(businessType: string): CanonicalBusinessProfile["layoutFamily"] {
  if (["indian_sweets_shop", "bakery", "restaurant", "cafe", "bar", "butcher"].includes(businessType)) return "food_product";
  if (["clothing", "shoe", "jewelry", "furniture", "florist", "electronics_store", "supermarket", "convenience", "bookstore", "pet", "optician"].includes(businessType)) return "retail_showcase";
  if (["lawyer", "accountant", "insurance", "real_estate", "advertising", "bank"].includes(businessType)) return "professional_trust";
  if (["salon", "gym", "electrician", "plumber", "car_repair", "laundry"].includes(businessType)) return "service_action";
  if (["hotel", "travel_agency"].includes(businessType)) return "hospitality_experience";
  if (["hospital", "clinic", "pharmacy", "dentist"].includes(businessType)) return "healthcare_clarity";
  if (["school", "university"].includes(businessType)) return "education_institution";
  return "trade_industrial";
}

function buildCapabilityEvidence(lead: any, description: string) {
  const metadata = (lead.metadata || {}) as Record<string, any>;
  const evidence = `${description} ${metadata.businessHours || ""} ${metadata.services || ""} ${metadata.features || ""}`.toLowerCase();
  const rules: Record<string, RegExp> = {
    delivery: /\b(delivery|home delivery|delivers)\b/,
    custom_orders: /\b(custom order|custom orders|made to order|personalized order|personalised order)\b/,
    online_ordering: /\b(online order|order online|online ordering)\b/,
    booking: /\b(booking|appointment|reservation)\b/,
    gift_boxes: /\b(gift box|gift boxes|gift pack)\b/,
    packaging: /\b(packaging|packed|packing service)\b/,
    discounts: /\b(discount|offer|offers|sale)\b/,
    emergency_24_7: /\b(24\/7|24 hours|round the clock|emergency service)\b/,
  };
  return Object.entries(rules)
    .filter(([, pattern]) => pattern.test(evidence))
    .map(([capability]) => capability);
}

function collectMediaEvidence(lead: any, businessName: string): MediaAsset[] {
  const metadata = (lead.metadata || {}) as Record<string, any>;
  const result: MediaAsset[] = [];
  const seen = new Set<string>();

  const add = (url: unknown, kind: MediaAsset["kind"], evidence: MediaAsset["evidence"], alt: string) => {
    if (typeof url !== "string" || !/^https?:\/\//i.test(url) || seen.has(url)) return;
    seen.add(url);
    result.push({ url, kind, evidence, alt });
  };

  add(metadata.logoUrl || metadata.logo, "logo", "business_provided", `${businessName} logo`);
  add(metadata.coverPhoto || metadata.coverPhotoUrl || metadata.heroImage, "cover", "business_provided", `${businessName} cover photo`);

  const businessPhotos = [
    ...(Array.isArray(metadata.photos) ? metadata.photos : []),
    ...(Array.isArray(metadata.images) ? metadata.images : []),
    ...(Array.isArray(metadata.gallery) ? metadata.gallery : []),
  ];

  businessPhotos.slice(0, 12).forEach((item: any, index: number) => {
    const url = typeof item === "string" ? item : item?.url;
    const kind = ["product", "interior", "exterior"].includes(item?.kind) ? item.kind : "gallery";
    const evidence =
      item?.verified === true ? "verified_source" :
      item?.source === "business" ? "business_provided" :
      "verified_source";
    add(url, kind, evidence, `${businessName} photo ${index + 1}`);
  });

  return result;
}


type FAQIntent =
  | "contact"
  | "location"
  | "hours"
  | "availability"
  | "offerings"
  | "delivery"
  | "custom_orders"
  | "online_ordering"
  | "booking"
  | "gift_boxes"
  | "packaging"
  | "discounts"
  | "emergency_24_7"
  | "other";

function normalizeFaqText(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(the|a|an|this|that|your|you|i|we|our|business|shop|store|company|please|can|do|does|is|are|what|how)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFaqIntent(item: FAQItem): FAQIntent {
  const text = `${item.question || ""} ${item.answer || ""}`.toLowerCase();

  if (/\b(phone|call|contact|whatsapp|email|reach|talk|connect)\b/.test(text)) return "contact";
  if (/\b(where|located|location|address|visit)\b/.test(text)) return "location";
  if (/\b(hour|hours|timing|timings|open|opening|closing|weekend|sunday)\b/.test(text)) return "hours";
  if (/\b(availability|available|in stock|stock|current options)\b/.test(text)) return "availability";
  if (/\b(offer|offers|provide|provides|product|products|service|services|sell|sells|types|selection)\b/.test(text)) return "offerings";
  if (/\b(delivery|deliver)\b/.test(text)) return "delivery";
  if (/\b(custom|customize|customise|made to order)\b/.test(text)) return "custom_orders";
  if (/\b(online order|order online|online ordering)\b/.test(text)) return "online_ordering";
  if (/\b(book|booking|appointment|reservation)\b/.test(text)) return "booking";
  if (/\b(gift box|gift boxes|gift pack)\b/.test(text)) return "gift_boxes";
  if (/\b(packaging|packing)\b/.test(text)) return "packaging";
  if (/\b(discount|offer price|sale)\b/.test(text)) return "discounts";
  if (/\b(24\/7|24 hours|emergency)\b/.test(text)) return "emergency_24_7";

  return "other";
}

function deduplicateFaqsByIntent(items: FAQItem[]) {
  const seenIntent = new Set<FAQIntent>();
  const seenNormalized = new Set<string>();
  const result: FAQItem[] = [];

  for (const item of items) {
    if (!item?.question || !item?.answer) continue;

    const normalized = normalizeFaqText(item.question);
    const intent = getFaqIntent(item);

    if (!normalized || seenNormalized.has(normalized)) continue;
    if (intent !== "other" && seenIntent.has(intent)) continue;

    seenNormalized.add(normalized);
    if (intent !== "other") seenIntent.add(intent);
    result.push(item);
  }

  return result;
}

function finalizeFaqs(items: FAQItem[], capabilities: string[]) {
  const safeFallbacks: FAQItem[] = [
    { question: "What does this business offer?", answer: "Explore the products, services and business information shown on this page." },
    { question: "Where is the business located?", answer: "See the contact section for the available address and location details." },
    { question: "What are the business hours?", answer: "Check the available business information or contact the business directly for current hours." },
    { question: "How can I contact the business?", answer: "Use the available phone or WhatsApp contact options on this page." },
    { question: "How can I ask about current availability?", answer: "Contact the business directly for current product or service availability." },
    { question: "Can I get more information before visiting?", answer: "Yes. Use the available contact details to ask for current business information." },
  ];

  let result = deduplicateFaqsByIntent(
    removeUnsupportedCapabilityFaqs(items, capabilities)
  );

  for (const fallback of safeFallbacks) {
    if (result.length >= 5) break;
    const candidate = deduplicateFaqsByIntent([...result, fallback]);
    if (candidate.length > result.length) result = candidate;
  }

  const guaranteedFallbacks: FAQItem[] = [
    { question: "What information is available on this page?", answer: "This page shows the available business overview, offerings and contact information." },
    { question: "How do I confirm current details?", answer: "Contact the business directly using the available contact information on this page." },
    { question: "What should I check before visiting?", answer: "Review the available address and business information, then contact the business if you need current details." },
    { question: "Can I ask about a specific product or service?", answer: "Yes. Contact the business directly to ask about current products, services or availability." },
    { question: "Where can I find the latest business information?", answer: "Use the contact details shown on this page to confirm the latest information directly with the business." },
  ];

  const usedQuestions = new Set(result.map((item) => normalizeFaqText(item.question)));
  for (const fallback of guaranteedFallbacks) {
    if (result.length >= 5) break;
    const normalized = normalizeFaqText(fallback.question);
    if (!usedQuestions.has(normalized)) {
      usedQuestions.add(normalized);
      result.push(fallback);
    }
  }

  return result.slice(0, 5);
}

function extractMediaUrl(item: any): string | null {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return null;
  return item.url || item.src || item.imageUrl || item.photoUrl || item.original || item.large || null;
}

function isUsableRemoteMediaUrl(url: unknown) {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      !/^(localhost|127\.0\.0\.1)$/i.test(parsed.hostname)
    );
  } catch {
    return false;
  }
}

function inferMediaKind(item: any, fallback: MediaAsset["kind"]): MediaAsset["kind"] {
  const value = String(item?.kind || item?.type || item?.category || "").toLowerCase();
  if (/\b(product|food|menu|item)\b/.test(value)) return "product";
  if (/\b(interior|inside|indoor)\b/.test(value)) return "interior";
  if (/\b(exterior|outside|storefront|shopfront)\b/.test(value)) return "exterior";
  if (/\b(cover|hero|banner)\b/.test(value)) return "cover";
  if (/\b(logo|brand)\b/.test(value)) return "logo";
  return fallback;
}

function acquireMediaEvidence(lead: any, businessName: string): MediaAsset[] {
  const metadata = (lead.metadata || {}) as Record<string, any>;
  const result: MediaAsset[] = [];
  const seen = new Set<string>();

  const add = (
    item: any,
    fallbackKind: MediaAsset["kind"],
    evidence: MediaAsset["evidence"],
    alt: string
  ) => {
    const url = extractMediaUrl(item);
    if (!isUsableRemoteMediaUrl(url) || seen.has(url!)) return;
    seen.add(url!);
    result.push({
      url: url!,
      kind: inferMediaKind(item, fallbackKind),
      evidence,
      alt: String(item?.alt || item?.caption || alt),
    });
  };

  add(metadata.logoUrl || metadata.logo, "logo", "business_provided", `${businessName} logo`);
  add(
    metadata.coverPhoto || metadata.coverPhotoUrl || metadata.heroImage || metadata.bannerImage,
    "cover",
    "business_provided",
    `${businessName} cover photo`
  );

  const businessProvided = [
    ...(Array.isArray(metadata.businessPhotos) ? metadata.businessPhotos : []),
    ...(Array.isArray(metadata.uploadedPhotos) ? metadata.uploadedPhotos : []),
    ...(Array.isArray(metadata.photos) ? metadata.photos : []),
    ...(Array.isArray(metadata.images) ? metadata.images : []),
    ...(Array.isArray(metadata.gallery) ? metadata.gallery : []),
  ];

  const verifiedSources = [
    ...(Array.isArray(metadata.sourcePhotos) ? metadata.sourcePhotos : []),
    ...(Array.isArray(metadata.verifiedPhotos) ? metadata.verifiedPhotos : []),
    ...(Array.isArray(metadata.placePhotos) ? metadata.placePhotos : []),
    ...(Array.isArray(metadata.osmPhotos) ? metadata.osmPhotos : []),
    ...(Array.isArray(metadata.wikimediaPhotos) ? metadata.wikimediaPhotos : []),
  ];

  businessProvided.slice(0, 20).forEach((item, index) => {
    const evidence =
      item?.verified === true || item?.evidence === "verified_source"
        ? "verified_source"
        : "business_provided";
    add(item, "gallery", evidence, `${businessName} business photo ${index + 1}`);
  });

  verifiedSources.slice(0, 20).forEach((item, index) => {
    add(item, "gallery", "verified_source", `${businessName} verified photo ${index + 1}`);
  });

  const hasCover = result.some((asset) => asset.kind === "cover");
  if (!hasCover) {
    const bestCover = result.find((asset) =>
      ["exterior", "interior", "product", "gallery"].includes(asset.kind)
    );
    if (bestCover) {
      result.unshift({ ...bestCover, kind: "cover", alt: `${businessName} cover photo` });
    }
  }

  return result.slice(0, 16);
}

function buildCanonicalBusinessProfile(lead: any, description: string): CanonicalBusinessProfile {
  const classification = classifyBusiness(lead, description);
  return {
    businessType: classification.businessType,
    categoryName: classification.categoryName,
    importedCategory: String(lead.category || "local_business"),
    description,
    confirmedCapabilities: buildCapabilityEvidence(lead, description),
    media: acquireMediaEvidence(lead, String(lead.businessName || "Business")),
    layoutFamily: getLayoutFamily(classification.businessType),
  };
}


function getPexelsSearchQuery(businessType: string) {
  const queries: Record<string, string> = {
    indian_sweets_shop: "premium indian sweets mithai shop",
    bakery: "artisan bakery cakes pastry shop",
    restaurant: "premium indian restaurant food dining",
    cafe: "modern cafe coffee interior",
    bar: "premium bar interior",
    hotel: "luxury hotel interior lobby",
    agricultural_trader: "agriculture farm products market",
    hardware_trader: "hardware tools store",
    electronics_store: "modern electronics store technology",
    salon: "luxury beauty salon interior",
    gym: "modern gym fitness interior",
    hospital: "modern hospital building",
    clinic: "modern medical clinic interior",
    pharmacy: "modern pharmacy store",
    dentist: "modern dental clinic interior",
    school: "school campus classroom",
    university: "college university campus",
    clothing: "fashion clothing store interior",
    shoe: "footwear shoe store",
    jewelry: "luxury jewelry store interior",
    furniture: "modern furniture showroom",
    florist: "flower shop florist",
    car_repair: "car repair garage workshop",
    electrician: "electrician electrical tools",
    plumber: "plumbing tools service",
    travel_agency: "travel destination tourism",
    real_estate: "modern real estate property",
    lawyer: "professional law office interior",
    accountant: "professional accounting office",
    insurance: "professional business office",
    advertising: "creative marketing agency office",
    supermarket: "modern supermarket grocery store",
    convenience: "convenience store interior",
    laundry: "modern laundry service",
    bookstore: "bookstore interior books",
    pet: "pet shop interior",
    optician: "optical eyewear store",
    florist_shop: "flower shop florist",
    butcher: "clean butcher shop meat counter",
  };

  return queries[businessType] || "modern local business storefront interior";
}

async function fetchPexelsDemoMedia(
  businessType: string,
  businessName: string
): Promise<MediaAsset[]> {
  if (!PEXELS_API_KEY) {
    console.log("PEXELS API KEY NOT FOUND - DEMO STOCK PHOTOS SKIPPED");
    return [];
  }

  const query = getPexelsSearchQuery(businessType);

  try {
    console.log("PEXELS DEMO PHOTO SEARCH:", {
      businessType,
      query,
    });

    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", "8");
    url.searchParams.set("orientation", "landscape");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(
        "PEXELS PHOTO SEARCH FAILED:",
        response.status,
        (await response.text()).slice(0, 500)
      );
      return [];
    }

    const data = await response.json();
    const photos = Array.isArray(data?.photos) ? data.photos : [];

    const assets: MediaAsset[] = photos
      .map((photo: any, index: number): MediaAsset | null => {
        const imageUrl =
          photo?.src?.large2x ||
          photo?.src?.large ||
          photo?.src?.landscape ||
          photo?.src?.original ||
          null;

        if (!isUsableRemoteMediaUrl(imageUrl)) return null;

        return {
          url: imageUrl,
          kind: index === 0 ? "cover" : "gallery",
          evidence: "demo_stock",
          alt:
            typeof photo?.alt === "string" && photo.alt.trim()
              ? photo.alt.trim()
              : `${businessName} demo ${businessType.replace(/_/g, " ")} image`,
        };
      })
      .filter((asset: MediaAsset | null): asset is MediaAsset => Boolean(asset));

    console.log("PEXELS DEMO PHOTOS ACQUIRED:", {
      businessType,
      query,
      count: assets.length,
    });

    return assets;
  } catch (error) {
    console.error("PEXELS DEMO PHOTO FETCH ERROR:", error);
    return [];
  }
}

async function ensureDemoMedia(
  profile: CanonicalBusinessProfile,
  businessName: string,
  currentEnrichmentMatched: boolean
): Promise<CanonicalBusinessProfile> {
  // IMPORTANT:
  // If the CURRENT enrichment run did not find a safe exact entity match,
  // do not trust old metadata media. It may belong to a previously
  // mis-matched business and can poison the regenerated demo.
  if (!currentEnrichmentMatched) {
    console.log(
      "NO CURRENT SAFE ENTITY MATCH - OLD MEDIA IGNORED, USING PEXELS DEMO FALLBACK",
      {
        businessName,
        ignoredMediaCount: profile.media.length,
      }
    );

    const demoMedia = await fetchPexelsDemoMedia(
      profile.businessType,
      businessName
    );

    return {
      ...profile,
      media: demoMedia,
    };
  }

  const hasRealVisual = profile.media.some(
    (asset) =>
      asset.evidence === "business_provided" ||
      asset.evidence === "verified_source"
  );

  if (hasRealVisual) {
    console.log("CURRENT VERIFIED BUSINESS MEDIA FOUND - PEXELS FALLBACK NOT USED", {
      businessName,
      mediaCount: profile.media.length,
    });

    return profile;
  }

  const demoMedia = await fetchPexelsDemoMedia(
    profile.businessType,
    businessName
  );

  return {
    ...profile,
    media: demoMedia,
  };
}

function removeUnsupportedCapabilityFaqs(items: FAQItem[], capabilities: string[]) {
  const allowed = new Set(capabilities);
  const capabilityPatterns: Array<[string, RegExp]> = [
    ["delivery", /\bdelivery|deliver\b/i],
    ["custom_orders", /\bcustom|customize|customise|made to order\b/i],
    ["online_ordering", /\bonline order|order online\b/i],
    ["booking", /\bbook|booking|appointment|reservation\b/i],
    ["gift_boxes", /\bgift box|gift pack\b/i],
    ["packaging", /\bpackaging|packing\b/i],
    ["discounts", /\bdiscount|offer|sale\b/i],
    ["emergency_24_7", /\b24\/7|24 hours|emergency\b/i],
  ];

  const safeFallbacks: FAQItem[] = [
    { question: "What does this business offer?", answer: "Explore the products, services and business information shown on this page." },
    { question: "Where is the business located?", answer: "See the contact section for the available address and location details." },
    { question: "How can I contact the business?", answer: "Use the available phone or WhatsApp contact options on this page." },
    { question: "How can I ask about current availability?", answer: "Contact the business directly for current product or service availability." },
    { question: "Can I get more information before visiting?", answer: "Yes. Use the available contact details to ask for current business information." },
  ];

  const kept = items.filter((item) => {
    const text = `${item.question || ""} ${item.answer || ""}`;
    return !capabilityPatterns.some(([capability, pattern]) => pattern.test(text) && !allowed.has(capability));
  });

  for (const fallback of safeFallbacks) {
    if (kept.length >= 5) break;
    if (!kept.some((item) => item.question.toLowerCase() === fallback.question.toLowerCase())) kept.push(fallback);
  }

  return kept.slice(0, 5);
}

async function generateWithGroq(prompt: string) {
  if (!GROQ_API_KEY) {
    console.log("GROQ API KEY NOT FOUND");
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a strict AI website director for real local Indian businesses. Accuracy is more important than persuasive copy. Treat only supplied business data as confirmed facts. Never invent products, services, facilities, delivery, custom orders, discounts, payment methods, booking, packaging, gift boxes, or availability. Convert plausible but unconfirmed capabilities into enquiry-safe wording. First infer the exact business type, then ensure every generated field belongs to that same business type. Return only valid JSON matching the exact requested structure. Do not use markdown code fences.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.45,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "GROQ GENERATION ERROR:",
        response.status,
        await response.text()
      );
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    return typeof content === "string" && content.trim()
      ? content.trim()
      : null;
  } catch (error) {
    console.error("GROQ FETCH ERROR:", error);
    return null;
  }
}


function applyTruthGuardV2(aiData: any, confirmedSource: string) {
  if (!aiData || typeof aiData !== "object") return aiData;

  const source = confirmedSource.toLowerCase();

  const riskyRules = [
    { terms: ["custom order", "custom orders", "custom mithai"], sourceTerms: ["custom order", "custom mithai"] },
    { terms: ["gift box", "gift boxes"], sourceTerms: ["gift box", "gift boxes"] },
    { terms: ["packaging", "packed for gifts"], sourceTerms: ["packaging", "packed for gifts"] },
    { terms: ["delivery", "home delivery"], sourceTerms: ["delivery", "home delivery"] },
    { terms: ["online order", "online ordering"], sourceTerms: ["online order", "online ordering"] },
    { terms: ["discount", "offer"], sourceTerms: ["discount", "offer"] },
    { terms: ["24/7", "round-the-clock"], sourceTerms: ["24/7", "round-the-clock"] },
    { terms: ["booking", "book online"], sourceTerms: ["booking", "book online"] },
  ];

  function unsupported(value: string) {
    const lower = value.toLowerCase();

    return riskyRules.some(
      (rule) =>
        rule.terms.some((term) => lower.includes(term)) &&
        !rule.sourceTerms.some((term) => source.includes(term))
    );
  }

  function safeService(item: any) {
    const title = String(item?.title || "Business Enquiry");
    const description = String(
      item?.description || "Contact the business directly for current details."
    );

    if (!unsupported(`${title} ${description}`)) {
      return { title, description };
    }

    return {
      title: title.toLowerCase().includes("celebr")
        ? "Celebration Enquiries"
        : "Business Enquiries",
      description:
        "Contact the business directly to confirm current availability or options.",
    };
  }

  function safeFaq(item: any) {
    const question = String(item?.question || "How can I confirm current options?");
    const answer = String(
      item?.answer ||
        "Please contact the business directly to confirm current availability or options."
    );

    return {
      question,
      answer: unsupported(`${question} ${answer}`)
        ? "Please contact the business directly to confirm current availability or options."
        : answer.replace(
            /current availability or option\b/gi,
            "current availability or options"
          ),
    };
  }

  if (Array.isArray(aiData.services)) {
    aiData.services = aiData.services.map(safeService);
  }

  if (Array.isArray(aiData.faqs)) {
    aiData.faqs = aiData.faqs.map(safeFaq);
  }

  return aiData;
}

function generateLogoSvg(
  businessName: string,
  primaryColor: string
) {
  const initials = businessName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const safeInitials = initials || "B";

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
  </defs>

  <rect
    width="120"
    height="120"
    rx="32"
    fill="url(#logoGradient)"
  />

  <circle
    cx="92"
    cy="28"
    r="16"
    fill="rgba(255,255,255,0.16)"
  />

  <text
    x="60"
    y="74"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="42"
    font-weight="700"
    fill="#ffffff"
  >
    ${safeInitials}
  </text>
</svg>
`.trim();
}


type EnrichmentGenerationResult = {
  lead: any;
  matched: boolean;
};

async function enrichLeadBeforeGeneration(
  lead: any,
  cookieHeader: string
): Promise<EnrichmentGenerationResult> {
  try {
    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

    console.log(
      "ENRICHING BUSINESS BEFORE GENERATION:",
      {
        leadId: lead.id,
        businessName: lead.businessName,
        city: lead.city,
        category: lead.category,
      }
    );

    if (
      !Number.isInteger(Number(lead.id)) ||
      Number(lead.id) <= 0
    ) {
      console.warn(
        "BUSINESS ENRICHMENT SKIPPED: INVALID LEAD ID",
        lead.id
      );

      return { lead, matched: false };
    }

    const response = await fetch(
      `${appUrl}/api/businesses/enrich`,
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },

        body: JSON.stringify({
          leadId: Number(lead.id),
        }),

        cache: "no-store",
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.warn(
        "BUSINESS ENRICHMENT SKIPPED:",
        response.status,
        responseText.slice(0, 500)
      );

      return { lead, matched: false };
    }

    let enrichmentData: any;

    try {
      enrichmentData = JSON.parse(responseText);
    } catch {
      console.warn(
        "BUSINESS ENRICHMENT INVALID JSON:",
        responseText.slice(0, 500)
      );

      return { lead, matched: false };
    }

    if (
      enrichmentData?.enriched !== true ||
      !enrichmentData?.lead
    ) {
      console.log(
        "NO SAFE BUSINESS ENRICHMENT MATCH FOUND:",
        lead.businessName
      );

      return { lead, matched: false };
    }

    const enrichedLead = enrichmentData.lead;

    console.log(
      "BUSINESS ENRICHMENT COMPLETE:",
      {
        leadId: enrichedLead.id,
        businessName:
          enrichedLead.businessName ||
          lead.businessName,

        source:
          enrichmentData?.enrichment?.source ||
          null,

        matchScore:
          enrichmentData?.enrichment?.matchScore ||
          null,

        matchReason:
          enrichmentData?.enrichment?.matchReason ||
          null,

        sourcePhotoCount:
          enrichmentData?.enrichment
            ?.sourcePhotoCount || 0,

        websiteFound:
          enrichmentData?.enrichment
            ?.websiteFound || false,

        osmId:
          enrichedLead.osmId || null,
      }
    );

    return { lead: enrichedLead, matched: true };
  } catch (error) {
    console.error(
      "BUSINESS ENRICHMENT FAILED, USING ORIGINAL LEAD:",
      error
    );

    return { lead, matched: false };
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json(
        {
          error: "Lead ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const [databaseLead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!databaseLead) {
      return NextResponse.json(
        {
          error: "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    const cookieHeader = req.headers.get("cookie") || "";

    const enrichmentResult = await enrichLeadBeforeGeneration(
      databaseLead,
      cookieHeader
    );

    const lead = enrichmentResult.lead;
    const currentEnrichmentMatched = enrichmentResult.matched;

    const businessName = lead.businessName;
    const businessDescription =
      getBusinessDescription(lead);

    const baseCanonicalProfile = buildCanonicalBusinessProfile(
      lead,
      businessDescription
    );

    const canonicalProfile = await ensureDemoMedia(
      baseCanonicalProfile,
      String(businessName || "Business"),
      currentEnrichmentMatched
    );

    const category = canonicalProfile.businessType;
    const categoryName = canonicalProfile.categoryName;
    const importedCategory = canonicalProfile.importedCategory;
    const layoutProfile = getLayoutProfile(category);

    const whatsapp = getWhatsApp(lead);

    const categoryConfig =
      getCategoryConfig(category);

    console.log("GENERATING WEBSITE:", businessName);
    console.log("CATEGORY:", category);
    console.log(
      "BUSINESS DESCRIPTION:",
      businessDescription
    );

    let heroData = {
      headline: `${businessName}`,
      subtitle: businessDescription,
    };

    let services = categoryConfig.services;

    let aboutContent = businessDescription;

    const layoutStyle = layoutProfile.layoutStyle;
    const heroVariant = layoutProfile.heroVariant;
    const servicesVariant = layoutProfile.servicesVariant;
    const visualDensity = layoutProfile.visualDensity;

    let directionTitle = "Care in every detail. Warm local service.";

    let mission = `To serve customers in ${
      lead.city || "the local community"
    } with reliable products, services and customer support.`;

    let faqs: FAQItem[] = [
      {
        question: `What does ${businessName} offer?`,
        answer: `${businessName} is a ${categoryName.toLowerCase()} business. Contact the business directly for current products, services and availability.`,
      },
      {
        question: `Where is ${businessName} located?`,
        answer: lead.address
          ? `${businessName} is located at ${lead.address}.`
          : `${businessName} serves customers in ${
              lead.city || "the local area"
            }.`,
      },
      {
        question: "How can I contact the business?",
        answer: lead.phone
          ? `You can contact the business by phone at ${lead.phone}.`
          : "Use the contact information available on this website.",
      },
      {
        question: "Can I ask about current availability?",
        answer:
          "Yes. Contact the business directly to confirm current product or service availability.",
      },
      {
        question: "Do you serve local customers?",
        answer: `${businessName} serves customers in ${
          lead.city || "the local community"
        } and surrounding areas.`,
      },
    ];

    const aiPrompt = `
You are the AI Website Director for an agency creating premium websites for real local Indian businesses.

BUSINESS DATA

Business name:
${businessName}

Imported category:
${importedCategory}

SERVER-VERIFIED BUSINESS TYPE:
${category}

SERVER-VERIFIED CATEGORY NAME:
${categoryName}

Location:
${lead.city || "Not provided"}, ${lead.state || ""}

Business description:
${businessDescription}

Analyze the business before writing copy.

CLASSIFICATION RULES:
- mithai, misthan, sweets, sweet shop, confectionery = indian_sweets_shop
- bakery, cakes, baked goods = bakery
- restaurant, dhaba, dining = restaurant
- hardware, traders, tools, building material = hardware_trader
- electronics, mobile, computer, laptop = electronics_store
- The SERVER-VERIFIED BUSINESS TYPE is authoritative and already validated against the name, imported category and description.
- Do not override or reinterpret the server-verified business type.
- a mithai or misthan shop must NOT be treated as a restaurant just because the description contains the word "food".

CONTENT RULES:
- Do not invent awards.
- Do not invent years of experience.
- Do not invent customer reviews or customer names.
- Do not invent discounts, prices, brands or customer counts.
- Do not claim 24/7 support, delivery or online booking unless provided.
- Do not invent products or facilities unsupported by the business context.
- Keep copy natural for an Indian local business.
- For indian_sweets_shop, use only sweets/mithai-shop language. Never use "bakery", "bakery products", "family dining", "restaurant", "good food", "dining", or generic food-service wording unless the source data explicitly says so.
- Never copy service language from a different business category.
- Every service title and description must directly match the inferred businessType.
- TRUTH GUARD: The business name, description, category, address, phone and hours are the only confirmed facts.
- Do not claim an exact product, facility, delivery option, custom order service, gift box, packaging service, discount, online ordering, booking, payment method or 24/7 support unless explicitly present in the confirmed source data.
- For plausible but unconfirmed offerings, use enquiry-safe language. Example: "Celebration Enquiries" with "Contact the shop to ask about sweets for celebrations." Never write "Custom mithai orders available" unless confirmed.
- Never convert an inference into a factual claim.
- FAQ answers about unknown details must say "Please contact the business directly to confirm current availability or options."
- Services may describe the confirmed core business category, but optional capabilities must be phrased as enquiries or availability checks.
- If exact products are unknown, use safe category-specific wording such as "traditional sweets", "mithai enquiries", "fresh selections", and "celebration requirements"; do not invent named products.
- Avoid vague phrases such as "local food items", "professional service", and "business solutions" when a more specific truthful category phrase is possible.
- The about, mission, directionTitle, services, FAQs, eyebrow and CTA must all use the same inferred business identity.
- directionTitle must be a premium two-part brand statement, maximum 8 words, specific to the inferred business type.
- Layout selection is controlled by the server. Do not make layout decisions.
- Focus on accurate, category-specific copy and visual color direction.
- Use the provided description as the primary source of truth.
- Hero headline maximum 9 words.
- Hero subtitle maximum 28 words.
- About maximum 90 words.
- Mission maximum 40 words.
- Return exactly 6 services and exactly 5 FAQs.
- Service descriptions should be 8 to 18 words.
- FAQ answers should be factual and concise.
- Before returning JSON, silently audit every claim. If a claim is not supported by the confirmed source data, rewrite it as an enquiry, availability check, or neutral category description.
- CTA must fit the business type; for a sweets shop prefer wording such as "Visit Us" or "Contact Shop".
- Colors must be valid 6-digit hex values.

DESIGN DIRECTION:
Choose a premium visual direction specific to the business.
Examples:
- indian_sweets_shop: premium Indian sweets, maroon/gold/cream
- bakery: warm elegant bakery, amber/brown/cream
- restaurant: cinematic food, red/orange/warm
- hardware_trader: industrial, orange/steel/dark
- electronics_store: futuristic technology, cyan/purple/dark

Return ONLY valid JSON in exactly this structure:

{
  "businessType": "specific_machine_readable_type",
  "categoryName": "Human readable specific category",
  "designStyle": "machine_readable_design_style",
  "primaryColor": "#000000",
  "secondaryColor": "#000000",
  "accentColor": "#000000",
  "eyebrow": "Short brand mood line",
  "cta": "Short CTA",
  "hero": {
    "headline": "Maximum 9 words",
    "subtitle": "Maximum 28 words"
  },
  "about": "Maximum 90 words",
  "directionTitle": "Maximum 8 words",
  "mission": "Maximum 40 words",
  "values": ["Value 1", "Value 2", "Value 3", "Value 4"],
  "services": [
    {
      "title": "Service title",
      "description": "Short factual description"
    }
  ],
  "faqs": [
    {
      "question": "Question",
      "answer": "Factual answer"
    }
  ]
}
`;

    const aiResponse =
      await generateWithGroq(aiPrompt);

    let aiBusinessType = category;
    let aiCategoryName = categoryName;
    let aiDesignStyle = "category_fallback";
    let aiPrimary = categoryConfig.primary;
    let aiSecondary = categoryConfig.secondary;
    let aiAccent = categoryConfig.accent;
    let aiEyebrow = categoryConfig.eyebrow;
    let aiCta = categoryConfig.cta;
    let aiValues = [
      "Customer Focus",
      "Reliable Service",
      "Clear Communication",
      "Local Connection",
    ];

    try {
      if (aiResponse) {
        const parsed = applyTruthGuardV2(
          JSON.parse(aiResponse),
          `${businessName} ${category} ${categoryName} ${businessDescription} ${lead.address || ""} ${lead.phone || ""} ${(lead.metadata as Record<string, any> | null)?.businessHours || ""}`
        );

        if (parsed.hero?.headline && parsed.hero?.subtitle) {
          heroData = parsed.hero;
        }

        if (Array.isArray(parsed.services) && parsed.services.length >= 3) {
          services = parsed.services.slice(0, 6);
        }

        if (Array.isArray(parsed.faqs) && parsed.faqs.length >= 3) {
          faqs = parsed.faqs.slice(0, 5);
        }

        if (parsed.about) aboutContent = parsed.about;
        if (
          typeof parsed.directionTitle === "string" &&
          parsed.directionTitle.trim()
        ) {
          directionTitle = parsed.directionTitle.trim();
        }
        if (parsed.mission) mission = parsed.mission;

        // Classification Guard: AI cannot override the deterministic server classification.
        aiBusinessType = category;
        aiCategoryName = categoryName;

        if (typeof parsed.designStyle === "string" && parsed.designStyle.trim()) {
          aiDesignStyle = parsed.designStyle.trim();
        }

        const validHex = (value: unknown) =>
          typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

        if (validHex(parsed.primaryColor)) aiPrimary = parsed.primaryColor;
        if (validHex(parsed.secondaryColor)) aiSecondary = parsed.secondaryColor;
        if (validHex(parsed.accentColor)) aiAccent = parsed.accentColor;

        if (typeof parsed.eyebrow === "string" && parsed.eyebrow.trim()) {
          aiEyebrow = parsed.eyebrow.trim();
        }

        if (typeof parsed.cta === "string" && parsed.cta.trim()) {
          aiCta = parsed.cta.trim();
        }

        if (Array.isArray(parsed.values) && parsed.values.length > 0) {
          aiValues = parsed.values
            .filter((value: unknown) => typeof value === "string")
            .slice(0, 4);
        }

        console.log("GROQ WEBSITE DIRECTOR GENERATED", {
          businessType: aiBusinessType,
          categoryName: aiCategoryName,
          designStyle: aiDesignStyle,
        });
      } else {
        console.log("USING SMART LOCAL FALLBACK CONTENT");
      }
    } catch (error) {
      console.error("GROQ CONTENT PARSE ERROR:", error);
      console.log("USING SMART LOCAL FALLBACK CONTENT");
    }

    faqs = finalizeFaqs(
      faqs,
      canonicalProfile.confirmedCapabilities
    );

    const existingWebsites = await db
      .select()
      .from(websites)
      .where(eq(websites.leadId, leadId))
      .orderBy(desc(websites.createdAt))
      .limit(1);

    const existingWebsite =
      existingWebsites[0] || null;

    const slug =
      existingWebsite?.slug ||
      generateSlug(businessName);

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

    const demoUrl = `${appUrl}/demo/${slug}`;

    const coverMedia =
      canonicalProfile.media.find(
        (asset) => asset.kind === "cover"
      ) || canonicalProfile.media[0] || null;

    const galleryMedia = canonicalProfile.media
      .filter(
        (asset, index, assets) =>
          asset.kind !== "logo" &&
          asset.url !== coverMedia?.url &&
          assets.findIndex(
            (candidate) => candidate.url === asset.url
          ) === index
      )
      .slice(0, 8);

    const pages = {
      home: {
        eyebrow: aiEyebrow,
        hero: {
          ...heroData,
          image: coverMedia?.url || null,
          imageAlt:
            coverMedia?.alt ||
            `${businessName} demo cover image`,
        },
        about: aboutContent,
        services,
        faqs,
        cta: {
          text: aiCta,
          subtext: `Connect with ${businessName} for more information.`,
        },
      },

      about: {
        title: `About ${businessName}`,
        content: aboutContent,
        directionTitle,
        mission,
        values: aiValues,
      },

      services: {
        title: "What We Offer",
        items: services,
      },

      contact: {
        title: "Contact Us",
        address: lead.address,
        city: lead.city,
        state: lead.state,
        country: lead.country,
        postalCode: lead.postalCode,
        phone: lead.phone,
        email: lead.email,
        whatsapp,
        latitude: lead.latitude,
        longitude: lead.longitude,
        mapUrl:
          lead.latitude && lead.longitude
            ? `https://www.openstreetmap.org/?mlat=${lead.latitude}&mlon=${lead.longitude}&zoom=16`
            : null,
      },

      faq: {
        title: "Frequently Asked Questions",
        items: faqs,
      },

      business: {
        name: businessName,
        category: aiBusinessType,
        categoryName: aiCategoryName,
        designStyle: aiDesignStyle,
        description: businessDescription,
        city: lead.city,
        state: lead.state,
      },

      media: {
        version: 2,
        cover: coverMedia
          ? {
              url: coverMedia.url,
              alt: coverMedia.alt,
              evidence: coverMedia.evidence,
              kind: coverMedia.kind,
            }
          : null,
        gallery: galleryMedia.map((asset) => ({
          url: asset.url,
          alt: asset.alt,
          evidence: asset.evidence,
          kind: asset.kind,
        })),
        assets: canonicalProfile.media,
      },
    };

    const websiteData = {
      businessName,
      demoUrl,
      pages,
      profile: canonicalProfile,
      media: {
        version: 2,
        assets: canonicalProfile.media,
        cover: canonicalProfile.media.find((asset) => asset.kind === "cover") || null,
        logo: canonicalProfile.media.find((asset) => asset.kind === "logo") || null,
        gallery: canonicalProfile.media
          .filter((asset, index, assets) =>
            asset.kind !== "logo" &&
            asset.kind !== "cover" &&
            assets.findIndex((candidate) => candidate.url === asset.url) === index
          )
          .slice(0, 8),
        acquisition: {
          businessProvided: canonicalProfile.media.filter((asset) => asset.evidence === "business_provided").length,
          verifiedSource: canonicalProfile.media.filter((asset) => asset.evidence === "verified_source").length,
          demoStock: canonicalProfile.media.filter((asset) => asset.evidence === "demo_stock").length,
        },
        policy: canonicalProfile.media.some((asset) => asset.evidence === "demo_stock")
          ? "verified_business_media_else_category_demo_stock"
          : "evidence_only_business_media",
      },
      design: {
        version: 2,
        layoutStyle,
        heroVariant,
        servicesVariant,
        visualDensity,
        source: "canonical_profile_layout_director",
        layoutFamily: canonicalProfile.layoutFamily,
      },
      seoTitle: `${businessName} | ${categoryName} in ${
        lead.city || "Your Area"
      }`,
      seoDescription: businessDescription.slice(
        0,
        300
      ),
      keywords: [
        category,
        businessName,
        lead.city || "local business",
        lead.state || "India",
      ],
      schemaOrg: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: businessName,
        description: businessDescription,
        address: {
          "@type": "PostalAddress",
          streetAddress: lead.address,
          addressLocality: lead.city,
          addressRegion: lead.state,
          postalCode: lead.postalCode,
          addressCountry: lead.country,
        },
        telephone: lead.phone,
        email: lead.email,
        url: demoUrl,
      },
      openGraph: {
        title: `${businessName} | ${categoryName}`,
        description: businessDescription,
        type: "website",
        url: demoUrl,
      },
      theme: {
        primary: aiPrimary,
        secondary: aiSecondary,
        accent: aiAccent,
        dark: categoryConfig.dark,
        light: categoryConfig.light,
        designStyle: aiDesignStyle,
        businessType: aiBusinessType,
      },
      logoSvg: generateLogoSvg(
        businessName,
        aiPrimary
      ),
      heroImage: coverMedia?.url || null,
      isPublished: true,
      updatedAt: new Date(),
    };

    let website;

    if (existingWebsite) {
      const [updatedWebsite] = await db
        .update(websites)
        .set(websiteData)
        .where(eq(websites.id, existingWebsite.id))
        .returning();

      website = updatedWebsite;

      console.log(
        "EXISTING WEBSITE REGENERATED:",
        website.id
      );
    } else {
      const [createdWebsite] = await db
        .insert(websites)
        .values({
          leadId,
          slug,
          ...websiteData,
        })
        .returning();

      website = createdWebsite;

      console.log(
        "NEW WEBSITE GENERATED:",
        website.id
      );
    }

    await db
      .update(leads)
      .set({
        status: "demo_sent",
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));

    await db.insert(activities).values({
      leadId,
      userId: user.id,
      type: "website_generated",
      description: existingWebsite
        ? `Website regenerated for ${businessName}`
        : `Website generated for ${businessName}`,
      metadata: {
        websiteId: website.id,
        slug,
        demoUrl,
        generationMode: aiResponse
          ? "groq"
          : "smart_fallback",
        aiModel: aiResponse ? GROQ_MODEL : null,
        businessType: aiBusinessType,
        categoryName: aiCategoryName,
        importedCategory,
        canonicalProfile,
        designStyle: aiDesignStyle,
        layoutProfile,
      },
    });

    return NextResponse.json({
      success: true,
      website,
      generationMode: aiResponse
        ? "groq"
        : "smart_fallback",
      ai: {
        model: aiResponse ? GROQ_MODEL : null,
        businessType: aiBusinessType,
        categoryName: aiCategoryName,
        designStyle: aiDesignStyle,
      },
    });
  } catch (error: any) {
    console.error(
      "WEBSITE GENERATION ERROR:",
      error
    );

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate website",
        details:
          error?.message ||
          "Unknown website generation error",
      },
      {
        status: 500,
      }
    );
  }
}