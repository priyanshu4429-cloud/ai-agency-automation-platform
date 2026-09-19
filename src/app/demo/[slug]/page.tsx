"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

type FAQItem = {
  question?: string;
  answer?: string;
};

type ServiceItem = {
  title?: string;
  description?: string;
};


type CategoryDesign = {
  key: "industrial" | "food" | "bakery" | "tech" | "default";
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  eyebrow: string;
  heroLine1: string;
  heroLine2: string;
  serviceTitle1: string;
  serviceTitle2: string;
  serviceCopy: string;
  aboutLine1: string;
  aboutLine2: string;
  directionLine1: string;
  directionLine2: string;
  badges: [string, string, string];
  visualLabel: string;
  visualSymbol: string;
};

function getCategoryDesign(value: string): CategoryDesign {
  const category = value.toLowerCase();
  const has = (items: string[]) => items.some((item) => category.includes(item));

  if (has(["hardware", "trader", "trading", "agriculture", "agricultural", "tools", "building material"])) {
    return {
      key: "industrial", primary: "#f97316", secondary: "#64748b", accent: "#fbbf24",
      background: "#070707", eyebrow: "Built for local trade. Ready for real requirements.",
      heroLine1: "Reliable local", heroLine2: "trade & supply.",
      serviceTitle1: "Products, supply", serviceTitle2: "and direct support.",
      serviceCopy: "Explore practical products, trading support and direct business assistance.",
      aboutLine1: "Local trade.", aboutLine2: "Strong connection.",
      directionLine1: "Practical service.", directionLine2: "Reliable communication.",
      badges: ["Reliable Supply", "Local Trade", "Direct Contact"],
      visualLabel: "TRADE CORE", visualSymbol: "⬡",
    };
  }

  if (has(["restaurant", "cafe", "food", "dhaba", "kitchen", "dining"])) {
    return {
      key: "food", primary: "#ef4444", secondary: "#f97316", accent: "#fbbf24",
      background: "#0b0706", eyebrow: "Local flavour. Warm service. Memorable moments.",
      heroLine1: "Taste the", heroLine2: "local experience.",
      serviceTitle1: "Fresh flavours,", serviceTitle2: "warm hospitality.",
      serviceCopy: "Discover the food, dining experience and direct service available from this local business.",
      aboutLine1: "Local flavour.", aboutLine2: "Warm presence.",
      directionLine1: "Good food.", directionLine2: "Better connection.",
      badges: ["Fresh Choice", "Local Flavour", "Easy Contact"],
      visualLabel: "SIGNATURE TASTE", visualSymbol: "✦",
    };
  }

  if (has(["bakery", "cake", "bakes", "sweet", "sweets", "confectionery"])) {
    return {
      key: "bakery", primary: "#d97706", secondary: "#92400e", accent: "#fcd34d",
      background: "#100a06", eyebrow: "Freshly baked. Thoughtfully made. Beautifully served.",
      heroLine1: "Made with care.", heroLine2: "Served with warmth.",
      serviceTitle1: "Fresh bakes,", serviceTitle2: "sweet moments.",
      serviceCopy: "Explore bakery products, celebration enquiries and direct local service.",
      aboutLine1: "Freshly made.", aboutLine2: "Beautifully presented.",
      directionLine1: "Care in every detail.", directionLine2: "Warm local service.",
      badges: ["Freshly Made", "Celebrations", "Local Care"],
      visualLabel: "BAKERY EDITION", visualSymbol: "✺",
    };
  }

  if (has(["electronics", "electronic", "mobile", "computer", "laptop", "technology", "tech", "digital"])) {
    return {
      key: "tech", primary: "#22d3ee", secondary: "#7c3aed", accent: "#a78bfa",
      background: "#030712", eyebrow: "Modern technology. Direct support. Local connection.",
      heroLine1: "Technology for", heroLine2: "everyday life.",
      serviceTitle1: "Devices, technology", serviceTitle2: "and direct support.",
      serviceCopy: "Explore electronic products, technology enquiries and direct customer assistance.",
      aboutLine1: "Modern technology.", aboutLine2: "Local presence.",
      directionLine1: "Clear information.", directionLine2: "Connected service.",
      badges: ["Modern Tech", "Product Help", "Connected"],
      visualLabel: "DIGITAL CORE", visualSymbol: "◈",
    };
  }

  return {
    key: "default", primary: "#8b5cf6", secondary: "#2563eb", accent: "#06b6d4",
    background: "#070707", eyebrow: "Local business. Modern experience.",
    heroLine1: "Local service.", heroLine2: "Modern experience.",
    serviceTitle1: "Services, solutions", serviceTitle2: "and direct support.",
    serviceCopy: "Explore the services and direct customer support available from this local business.",
    aboutLine1: "Local service.", aboutLine2: "Modern presence.",
    directionLine1: "Clear communication.", directionLine2: "Reliable connection.",
    badges: ["Reliable", "Local", "Direct"],
    visualLabel: "BUSINESS CORE", visualSymbol: "◆",
  };
}

export default function DemoPage() {
  const params = useParams();
  const slug = String(params.slug || "");

  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function normalizeWebsitePayload(payload: any): any {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const candidateFromWebsite = payload.website && typeof payload.website === "object"
      ? payload.website
      : null;

    if (candidateFromWebsite) {
      const hasWebsiteShape =
        candidateFromWebsite.pages ||
        candidateFromWebsite.profile ||
        candidateFromWebsite.design ||
        candidateFromWebsite.businessName ||
        candidateFromWebsite.theme ||
        candidateFromWebsite.media ||
        candidateFromWebsite.hero ||
        candidateFromWebsite.about ||
        candidateFromWebsite.services ||
        candidateFromWebsite.faq ||
        candidateFromWebsite.gallery ||
        candidateFromWebsite.reviews ||
        candidateFromWebsite.contact;

      if (hasWebsiteShape) {
        return candidateFromWebsite;
      }
    }

    const candidateFromData = payload.data && typeof payload.data === "object"
      ? payload.data
      : null;

    if (candidateFromData) {
      const nestedWebsite = candidateFromData.website && typeof candidateFromData.website === "object"
        ? candidateFromData.website
        : candidateFromData;

      const hasDataShape =
        nestedWebsite.pages ||
        nestedWebsite.profile ||
        nestedWebsite.design ||
        nestedWebsite.businessName ||
        nestedWebsite.theme ||
        nestedWebsite.media ||
        nestedWebsite.hero ||
        nestedWebsite.about ||
        nestedWebsite.services ||
        nestedWebsite.faq ||
        nestedWebsite.gallery ||
        nestedWebsite.reviews ||
        nestedWebsite.contact;

      if (hasDataShape) {
        return nestedWebsite;
      }
    }

    const hasTopLevelWebsiteShape =
      payload.pages ||
      payload.profile ||
      payload.design ||
      payload.businessName ||
      payload.theme ||
      payload.media ||
      payload.hero ||
      payload.about ||
      payload.services ||
      payload.faq ||
      payload.gallery ||
      payload.reviews ||
      payload.contact;

    if (hasTopLevelWebsiteShape) {
      return payload;
    }

    return null;
  }

  useEffect(() => {
    async function loadWebsite() {
      try {
        if (!slug) {
          setWebsite(null);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/demo/${slug}`);

        if (!response.ok) {
          setWebsite(null);
          return;
        }

        const payload = await response.json();
        setWebsite(normalizeWebsitePayload(payload));
      } catch (error) {
        console.error("DEMO LOAD ERROR:", error);
        setWebsite(null);
      } finally {
        setLoading(false);
      }
    }

    loadWebsite();
  }, [slug]);

  const phoneHref = useMemo(() => {
    const phone = website?.pages?.contact?.phone;

    if (!phone) {
      return "#contact";
    }

    return `tel:${String(phone).replace(/\s/g, "")}`;
  }, [website]);

  const whatsappHref = useMemo(() => {
    const contact = website?.pages?.contact || {};

    const rawNumber = contact.whatsapp || contact.phone || "";
    const number = String(rawNumber).replace(/\D/g, "");

    if (!number) {
      return "#contact";
    }

    const businessName = website?.businessName || "your business";

    const message = encodeURIComponent(
      `Hi ${businessName}, I would like to know more about your products and services.`
    );

    return `https://wa.me/${number}?text=${message}`;
  }, [website]);

  function scrollToSection(id: string) {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (loading) {
    return (
      <main className="min-h-[68vh] bg-[#070707] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="premium-loader mx-auto" />

          <p className="mt-5 text-sm text-zinc-500">
            Loading business experience...
          </p>
        </div>
      </main>
    );
  }

  if (!website) {
    return (
      <main className="min-h-[68vh] bg-[#070707] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black">
            Website Not Found
          </h1>

          <p className="mt-4 text-zinc-500">
            This business preview is not available.
          </p>
        </div>
      </main>
    );
  }

  const pages = website.pages || {};
  const home = pages.home || {};
  const about = pages.about || {};
  const design = website.design || {};

  const layoutStyle = ["editorial", "showcase", "compact"].includes(
    design.layoutStyle
  )
    ? design.layoutStyle
    : "showcase";

  const profile = website.profile || {};
  const media = website.media || {};
  const layoutFamily = [
    "food_product",
    "retail_showcase",
    "professional_trust",
    "service_action",
    "hospitality_experience",
    "healthcare_clarity",
    "education_institution",
    "trade_industrial",
  ].includes(design.layoutFamily)
    ? design.layoutFamily
    : "trade_industrial";
  const normalizeMediaUrl = (item: any): string | null => {
    if (!item) return null;
    if (typeof item === "string") return item;
    if (typeof item?.url === "string") return item.url;
    if (typeof item?.src === "string") return item.src;
    if (typeof item?.image === "string") return item.image;
    return null;
  };

  const rawGalleryItems = Array.isArray(media.gallery) ? media.gallery : [];
  const galleryItems = rawGalleryItems
    .map((item: any) => ({
      ...((item && typeof item === "object") ? item : {}),
      url: normalizeMediaUrl(item),
    }))
    .filter((item: any) => Boolean(item.url))
    .slice(0, 8);

  const coverPhoto =
    normalizeMediaUrl(media.cover) ||
    galleryItems[0]?.url ||
    null;

  const heroSidePhoto =
    galleryItems.find((item: any) => item.url !== coverPhoto)?.url ||
    galleryItems[0]?.url ||
    coverPhoto ||
    null;
  const heroVariant = ["split", "centered", "offset"].includes(design.heroVariant)
    ? design.heroVariant
    : "split";
  const servicesVariant = ["grid", "featured", "compact"].includes(design.servicesVariant)
    ? design.servicesVariant
    : "grid";
  const visualDensity = ["airy", "balanced", "dense"].includes(design.visualDensity)
    ? design.visualDensity
    : "balanced";
  const sectionSpacing =
    visualDensity === "airy"
      ? "py-20 md:py-24"
      : visualDensity === "dense"
        ? "py-10 md:py-12"
        : "py-14 md:py-16";

  const services = pages.services || {};
  const contact = pages.contact || {};
  const faq = pages.faq || {};
  const business = pages.business || {};

  const theme = website.theme || {};

  const categoryName =
    business.categoryName ||
    business.category ||
    website.category ||
    "Local Business";

  const categoryDesign = getCategoryDesign(String(categoryName));

  // AI theme first. Category design is only a safe fallback.
  const primary = theme.primary || categoryDesign.primary;
  const secondary = theme.secondary || categoryDesign.secondary;
  const accent = theme.accent || categoryDesign.accent;

  const serviceItems: ServiceItem[] =
    services.items || home.services || [];

  const faqItems: FAQItem[] =
    faq.items || home.faqs || [];

  const description =
    home.hero?.subtitle ||
    business.description ||
    about.content ||
    `Discover ${website.businessName}.`;

  // AI-generated content first; category copy is fallback only.
  const heroEyebrow =
    home.hero?.eyebrow ||
    home.eyebrow ||
    theme.eyebrow ||
    categoryDesign.eyebrow;

  const heroHeadline =
    home.hero?.headline ||
    `${categoryDesign.heroLine1} ${categoryDesign.heroLine2}`;

  const aboutTitle =
    about.title ||
    about.headline ||
    home.aboutTitle ||
    `${categoryDesign.aboutLine1} ${categoryDesign.aboutLine2}`;

  const directionTitle =
    about.directionTitle ||
    home.directionTitle ||
    about.vision ||
    `${categoryDesign.directionLine1} ${categoryDesign.directionLine2}`;

  const servicesTitle =
    services.title ||
    services.headline ||
    home.servicesTitle ||
    `${categoryDesign.serviceTitle1} ${categoryDesign.serviceTitle2}`;

  const servicesCopy =
    services.description ||
    services.subtitle ||
    (/(sweet|sweets|mithai|misthan|confection)/i.test(
      `${website.category || ""} ${business.category || ""} ${business.businessType || ""} ${description}`
    )
      ? "Explore fresh sweets, celebration enquiries and direct local service."
      : `Explore the services and direct local support available from ${website.businessName}.`);

  const aiBadges =
    Array.isArray(home.badges) && home.badges.length >= 3
      ? home.badges.slice(0, 3).map(String)
      : Array.isArray(theme.badges) && theme.badges.length >= 3
        ? theme.badges.slice(0, 3).map(String)
        : categoryDesign.badges;

  const visualLabel =
    theme.visualLabel ||
    business.businessType ||
    business.categoryName ||
    categoryDesign.visualLabel;

  function splitDisplayTitle(value: string) {
    const clean = String(value || "").trim();
    const parts = clean.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);

    if (parts.length >= 2) {
      return [parts[0], parts.slice(1).join(" ")];
    }

    const words = clean.split(/\s+/);
    if (words.length >= 4) {
      const middle = Math.ceil(words.length / 2);
      return [words.slice(0, middle).join(" "), words.slice(middle).join(" ")];
    }

    return [clean, ""];
  }

  const [aboutLine1, aboutLine2] = splitDisplayTitle(aboutTitle);
  const [directionLine1, directionLine2] = splitDisplayTitle(directionTitle);
  const [serviceLine1, serviceLine2] = splitDisplayTitle(servicesTitle);

  const navItems = [
    ["home", "Home"],
    ["about", "About"],
    ["services", "Services"],
    ...(galleryItems.length > 0 ? [["gallery", "Gallery"]] : []),
    ["faq", "FAQ"],
    ["contact", "Contact"],
  ];

  return (
    <main
      className={`category-${categoryDesign.key} family-${layoutFamily} min-h-[68vh] overflow-hidden text-white`}
      style={
        {
          "--primary": primary,
          "--secondary": secondary,
          "--accent": accent,
          "--page-bg": categoryDesign.background,
          background: categoryDesign.background,
        } as React.CSSProperties
      }
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #070707;
        }

        .premium-grid {
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            );
          background-size: 64px 64px;
        }


        .category-industrial .premium-grid {
          background-image:
            linear-gradient(rgba(249, 115, 22, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.05) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        .category-food .premium-grid {
          background-image:
            radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.12), transparent 28%),
            radial-gradient(circle at 80% 60%, rgba(249, 115, 22, 0.09), transparent 32%);
        }

        .category-bakery .premium-grid {
          background-image:
            radial-gradient(circle at 20px 20px, rgba(252, 211, 77, 0.08) 2px, transparent 2px);
          background-size: 52px 52px;
        }

        .category-tech .premium-grid {
          background-image:
            linear-gradient(rgba(34, 211, 238, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.055) 1px, transparent 1px);
          background-size: 54px 54px;
        }

        .category-food .service-card,
        .category-bakery .service-card {
          border-radius: 42px;
        }

        .visual-ring {
          animation: visualRing 12s linear infinite;
        }

        @keyframes visualRing {
          to {
            transform: rotate(360deg);
          }
        }


        .family-food_product .service-card:nth-child(1),
        .family-retail_showcase .service-card:nth-child(1) { grid-column: span 2; }
        .family-professional_trust .service-card { min-height: 220px; }
        .family-service_action .service-card { border-radius: 18px; }
        .family-hospitality_experience section { scroll-margin-top: 92px; }
        .family-healthcare_clarity .service-card { background: rgba(255,255,255,.055); }
        .family-education_institution .service-card:nth-child(odd) { transform: translateY(10px); }
        .family-trade_industrial .service-card { border-radius: 14px; }
        @media (max-width: 767px) {
          .family-food_product .service-card:nth-child(1),
          .family-retail_showcase .service-card:nth-child(1) { grid-column: span 1; }
          .family-education_institution .service-card:nth-child(odd) { transform: none; }
        }

        .premium-loader {
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--primary, #f97316);
          animation: premiumSpin 0.8s linear infinite;
        }

        .hero-orbit {
          animation: heroOrbit 18s linear infinite;
        }

        .hero-float {
          animation: heroFloat 5s ease-in-out infinite;
        }

        .hero-float-delayed {
          animation: heroFloat 6s ease-in-out 1s infinite;
        }

        .hero-pulse {
          animation: heroPulse 3.5s ease-in-out infinite;
        }

        .service-card {
          transform-style: preserve-3d;
          transition:
            transform 300ms ease,
            border-color 300ms ease,
            background 300ms ease;
        }

        .service-card:hover {
          transform:
            perspective(900px)
            translateY(-8px)
            rotateX(3deg)
            rotateY(-3deg);
          border-color: color-mix(
            in srgb,
            var(--primary) 45%,
            transparent
          );
          background: rgba(255, 255, 255, 0.06);
        }

        .premium-glass {
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(18px);
        }

        @keyframes premiumSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes heroOrbit {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes heroFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-18px);
          }
        }

        @keyframes heroPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }

          50% {
            transform: scale(1.18);
            opacity: 1;
          }
        }

        /* FINAL PREMIUM HERO SYSTEM */
        .hero-shell { isolation: isolate; border-bottom: 1px solid rgba(255,255,255,.08); }
        .hero-cover { opacity: .72; filter: saturate(1.08) contrast(1.04); transform: scale(1.015); }
        .hero-overlay-x { background: linear-gradient(90deg,rgba(0,0,0,.97) 0%,rgba(0,0,0,.88) 27%,rgba(0,0,0,.52) 55%,rgba(0,0,0,.28) 78%,rgba(0,0,0,.62) 100%); }
        .hero-overlay-y { background: linear-gradient(180deg,rgba(0,0,0,.40) 0%,transparent 24%,transparent 62%,rgba(0,0,0,.90) 100%); }
        .hero-title { font-size: clamp(3.5rem,6.35vw,7.8rem); text-wrap: balance; text-shadow: 0 8px 40px rgba(0,0,0,.42); }
        .hero-photo-card { box-shadow: 0 70px 160px rgba(0,0,0,.72),0 0 0 1px color-mix(in srgb,var(--primary) 35%,transparent),0 0 90px color-mix(in srgb,var(--primary) 18%,transparent) !important; }
        .hero-photo-card img { transform: scale(1.02); transition: transform 1.1s cubic-bezier(.2,.8,.2,1); }
        .hero-photo-card:hover img { transform: scale(1.075); }
        section { scroll-margin-top: 96px; }
        @media (max-width:1023px) { .hero-cover{opacity:.52}.hero-overlay-x{background:linear-gradient(90deg,rgba(0,0,0,.96),rgba(0,0,0,.64))}.hero-title{font-size:clamp(3.4rem,11vw,6.4rem)} }
        @media (max-width:639px) { .hero-shell{min-height:100svh;padding-top:7rem;padding-bottom:4rem}.hero-cover{opacity:.44}.hero-overlay-x{background:linear-gradient(90deg,rgba(0,0,0,.96),rgba(0,0,0,.70))}.hero-title{font-size:clamp(3rem,15vw,4.8rem);line-height:.9} }
        /* MOBILE RESPONSIVE FIXES */
        @media (max-width: 639px) {
          body { overflow-x: hidden; }
          .premium-grid { background-size: 42px 42px; }
          .hero-shell { min-height: auto !important; padding-top: 7rem !important; padding-bottom: 3.5rem !important; }
          .hero-title { font-size: clamp(3rem, 14vw, 4.25rem) !important; line-height: .92 !important; letter-spacing: -.055em !important; }
          .service-card { min-height: 0 !important; border-radius: 24px !important; padding: 1.5rem !important; }
          .service-card:hover { transform: none; }
          .service-card p:first-of-type { font-size: 2.5rem !important; }
          #about, #services, #gallery, #faq, #contact { padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 3.5rem !important; padding-bottom: 3.5rem !important; }
          #about .premium-glass { border-radius: 26px !important; padding: 1.5rem !important; }
          #services h2, #gallery h2, #faq h2, #contact h2 { font-size: clamp(2.6rem, 12vw, 4rem) !important; line-height: .95 !important; }
          #services .mt-16 { margin-top: 2.25rem !important; }
          #gallery .mt-12 { margin-top: 2rem !important; grid-auto-rows: auto !important; }
          #gallery figure { min-height: 0 !important; height: auto !important; aspect-ratio: 4 / 3; border-radius: 22px !important; }
          #gallery figure:first-child { aspect-ratio: 4 / 3; }
          #faq .mt-16 { margin-top: 2.5rem !important; }
          #faq .premium-glass { border-radius: 22px !important; }
          #faq button { padding: 1.25rem !important; gap: 1rem !important; }
          #faq button > span { font-size: 1rem !important; line-height: 1.45 !important; }
          #contact > div.relative { border-radius: 28px !important; }
          #contact .grid > div { padding: 1.5rem !important; }
          footer { padding-left: 1rem !important; padding-right: 1rem !important; }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #070707;
        }

        ::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 9999px;
        }
      `}</style>

      <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="premium-glass mx-auto max-w-7xl rounded-2xl">
          <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-5 lg:px-7">
            <button
              onClick={() => scrollToSection("home")}
              className="flex min-w-0 items-center gap-3"
            >
              {website.logoSvg ? (
                <div
                  className="h-10 w-10 shrink-0 [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{
                    __html: website.logoSvg,
                  }}
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-black text-black"
                  style={{ background: primary }}
                >
                  {website.businessName?.[0] || "B"}
                </div>
              )}

              <div className="min-w-0 text-left">
                <div className="truncate font-black tracking-tight">
                  {website.businessName}
                </div>

                <div
                  className="truncate text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: primary }}
                >
                  {categoryName}
                </div>
              </div>
            </button>

            <div className="hidden items-center gap-1 lg:flex">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="rounded-xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollToSection("contact")}
              className="hidden rounded-xl px-5 py-2.5 text-sm font-black text-black transition hover:scale-105 sm:block"
              style={{ background: primary }}
            >
              Contact Us
            </button>

            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 sm:hidden"
              aria-label="Open menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-white/10 px-4 pb-4 pt-3 sm:hidden">
              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/5"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <section
        id="home"
        className="premium-grid relative hero-shell premium-grid relative flex min-h-[100svh] items-center px-5 pb-16 pt-28 lg:px-8 lg:pb-20 lg:pt-28"
      >
        {coverPhoto && (
          <>
            <img
              src={coverPhoto}
              alt=""
              className="hero-cover absolute inset-0 h-full w-full object-cover"
            />
            <div className="hero-overlay-x absolute inset-0" />
            <div className="hero-overlay-y absolute inset-0" />
          </>
        )}

        <div
          className="absolute -right-56 -top-40 h-[620px] w-[620px] rounded-full opacity-20 blur-[170px]"
          style={{ background: primary }}
        />

        <div
          className="absolute -bottom-64 -left-48 h-[560px] w-[560px] rounded-full opacity-15 blur-[170px]"
          style={{ background: secondary }}
        />

        <div
          className={`relative z-10 mx-auto grid w-full items-center ${
            heroVariant === "centered"
              ? "max-w-5xl gap-10 text-center"
              : heroVariant === "offset"
                ? "max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24"
                : "max-w-[1600px] gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-14 xl:gap-20"
          }`}
        >
          <div className={heroVariant === "centered" ? "mx-auto flex max-w-4xl flex-col items-center" : ""}>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em]"
              style={{
                color: primary,
                borderColor: `${primary}55`,
                background: `${primary}10`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />

              {heroEyebrow}
            </div>

            <h1 className="hero-title mt-8 max-w-5xl font-black leading-[0.88] tracking-[-0.065em]">
              {heroHeadline}
            </h1>

            <div
              className="mt-8 h-1.5 w-28 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${primary}, ${accent})`,
              }}
            />

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              {description}
            </p>

            <div className={`mt-10 flex flex-col gap-4 sm:flex-row ${heroVariant === "centered" ? "justify-center" : ""}`}>
              <button
                onClick={() => scrollToSection("contact")}
                className="flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-black text-black transition hover:-translate-y-1"
                style={{
                  background: primary,
                  boxShadow: `0 20px 70px ${primary}30`,
                }}
              >
                {home.cta?.text || "Contact Us"}

                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => scrollToSection("services")}
                className="premium-glass rounded-2xl px-7 py-4 font-bold transition hover:bg-white/[0.08]"
              >
                Explore Business
              </button>
            </div>

            <div className={`mt-12 grid max-w-xl grid-cols-3 gap-3 ${heroVariant === "centered" ? "mx-auto" : ""}`}>
              <FeatureBadge
                icon={ShieldCheck}
                label={aiBadges[0]}
                color={primary}
              />

              <FeatureBadge
                icon={MapPin}
                label={aiBadges[1]}
                color={primary}
              />

              <FeatureBadge
                icon={Zap}
                label={aiBadges[2]}
                color={primary}
              />
            </div>
          </div>

          <div
            className={`relative min-h-[580px] items-center justify-center md:flex ${
              heroVariant === "centered" ? "hidden" : "hidden md:flex"
            } ${heroVariant === "offset" ? "lg:order-first" : ""}`}
          >
            <div
              className="absolute h-[430px] w-[430px] rounded-full opacity-20 blur-[100px]"
              style={{ background: primary }}
            />

            <div className="hero-float relative h-[500px] w-[500px] xl:h-[560px] xl:w-[560px]">
              {heroSidePhoto ? (
                <>
                  <div
                    className="hero-photo-card absolute inset-3 overflow-hidden rounded-[64px] border border-white/10 bg-black/40"
                    style={{
                      boxShadow: `0 50px 130px ${primary}25`,
                      transform:
                        "perspective(1400px) rotateX(5deg) rotateY(-7deg) rotateZ(2deg)",
                    }}
                  >
                    <img
                      src={heroSidePhoto}
                      alt={`${website.businessName} demo visual`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <p className="text-2xl font-black">
                        {website.businessName}
                      </p>
                      <p
                        className="mt-2 text-xs uppercase tracking-[0.3em]"
                        style={{ color: primary }}
                      >
                        Demo visual · {visualLabel}
                      </p>
                    </div>
                  </div>

                  <div className="hero-orbit absolute -right-3 -top-3 h-24 w-24 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl" />
                  <div className="hero-float-delayed absolute -bottom-4 -left-5 h-20 w-32 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl" />
                </>
              ) : (
                <>
              <div
                className="absolute inset-8 rounded-[72px] border backdrop-blur-2xl"
                style={{
                  borderColor: `${primary}55`,
                  background: `linear-gradient(135deg, ${primary}28, rgba(255,255,255,0.025))`,
                  boxShadow: `0 50px 130px ${primary}25`,
                  transform:
                    "perspective(1000px) rotateX(13deg) rotateY(-18deg) rotateZ(10deg)",
                }}
              />

              <div
                className="absolute inset-20 rounded-[55px] border border-white/10 bg-black/50"
                style={{
                  transform:
                    "perspective(1000px) rotateX(-6deg) rotateY(12deg)",
                }}
              />

              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-[42px] border border-white/10 bg-black/40">
                    <div
                      className="visual-ring absolute inset-[-18px] rounded-[52px] border border-dashed opacity-40"
                      style={{ borderColor: primary }}
                    />
                    <span
                      className="absolute -right-3 -top-5 text-4xl"
                      style={{ color: accent }}
                    >
                      {categoryDesign.visualSymbol}
                    </span>

                    {website.logoSvg ? (
                      <div
                        className="h-28 w-28 [&>svg]:h-full [&>svg]:w-full"
                        dangerouslySetInnerHTML={{
                          __html: website.logoSvg,
                        }}
                      />
                    ) : (
                      <div
                        className="flex h-28 w-28 items-center justify-center rounded-[32px] text-5xl font-black text-black"
                        style={{ background: primary }}
                      >
                        {website.businessName?.[0] || "B"}
                      </div>
                    )}
                  </div>

                  <h2 className="mt-7 text-2xl font-black">
                    {website.businessName}
                  </h2>

                  <p
                    className="mt-2 text-xs uppercase tracking-[0.3em]"
                    style={{ color: primary }}
                  >
                    {visualLabel}
                  </p>
                </div>
              </div>

              <div className="hero-orbit absolute -right-3 -top-3 h-24 w-24 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl" />

              <div className="hero-float-delayed absolute -bottom-4 -left-5 h-20 w-32 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl" />

              <div
                className="hero-pulse absolute left-2 top-24 h-9 w-9 rounded-full"
                style={{
                  background: accent,
                  boxShadow: `0 0 55px ${accent}`,
                }}
              />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className={`relative px-5 ${sectionSpacing}`}
      >
        <div className={`mx-auto grid max-w-7xl items-center gap-14 ${
            layoutStyle === "editorial"
              ? "lg:grid-cols-[0.82fr_1.18fr] lg:gap-20"
              : layoutStyle === "compact"
                ? "lg:grid-cols-[1.2fr_0.8fr] lg:gap-10"
                : "lg:grid-cols-2"
          }`}>
          <div className="premium-glass relative overflow-hidden rounded-[38px] p-8 sm:p-12">
            <div
              className="absolute -right-3 -top-10 text-[140px] font-black leading-none opacity-10"
              style={{ color: primary }}
            >
              01
            </div>

            <p
              className="text-sm font-bold uppercase tracking-[0.28em]"
              style={{ color: primary }}
            >
              About the business
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              {aboutLine1}
              <br />
              <span style={{ color: primary }}>
                {aboutLine2}
              </span>
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-zinc-400">
              {about.content ||
                home.about ||
                business.description ||
                description}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-600">
              Business direction
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              {directionLine1}
              <br />
              {directionLine2}
            </h2>

            {about.mission && (
              <div className="premium-glass mt-9 rounded-3xl p-7">
                <p
                  className="text-sm font-black uppercase tracking-[0.2em]"
                  style={{ color: primary }}
                >
                  Mission
                </p>

                <p className="mt-4 leading-relaxed text-zinc-400">
                  {about.mission}
                </p>
              </div>
            )}

            {Array.isArray(about.values) &&
              about.values.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {about.values.map(
                    (value: string, index: number) => (
                      <span
                        key={`${value}-${index}`}
                        className="premium-glass rounded-2xl px-5 py-3 text-sm text-zinc-300"
                      >
                        {value}
                      </span>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      </section>

      <section
        id="services"
        className={`relative px-5 ${sectionSpacing}`}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(circle at center, ${primary}12, transparent 55%)`,
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          <p
            className="text-sm font-bold uppercase tracking-[0.3em]"
            style={{ color: primary }}
          >
            What we offer
          </p>

          <h2 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-[-0.05em] sm:text-7xl">
            {serviceLine1}
            <br />
            {serviceLine2}
          </h2>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-zinc-500">
            {servicesCopy} Contact{" "}
            {website.businessName} directly for current availability.
          </p>

          <div className={`mt-16 grid gap-5 ${
            servicesVariant === "compact"
              ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
              : servicesVariant === "featured"
                ? "md:grid-cols-2 lg:grid-cols-2"
                : "md:grid-cols-2 lg:grid-cols-3"
          }`}>
            {serviceItems.map((service, index) => (
              <article
                key={`${service.title}-${index}`}
                className={`service-card relative overflow-hidden border border-white/10 bg-white/[0.035] ${
                  servicesVariant === "compact"
                    ? "min-h-[190px] rounded-2xl p-5"
                    : servicesVariant === "featured"
                      ? "min-h-[320px] rounded-[38px] p-10"
                      : "min-h-[280px] rounded-[32px] p-8"
                }`}
              >
                <div
                  className="absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-10 blur-[70px]"
                  style={{ background: primary }}
                />

                <p
                  className={`${servicesVariant === "compact" ? "text-4xl" : "text-6xl"} font-black opacity-15`}
                  style={{ color: primary }}
                >
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className={`${servicesVariant === "compact" ? "mt-5 text-lg" : "mt-8 text-2xl"} font-black`}>
                  {service.title}
                </h3>

                <p className="mt-4 leading-relaxed text-zinc-500">
                  {service.description}
                </p>

                <div
                  className="absolute inset-x-0 bottom-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${primary}, transparent)`,
                  }}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {galleryItems.length > 0 && (
        <section
          id="gallery"
          className={`relative px-5 ${sectionSpacing}`}
        >
          <div className="mx-auto max-w-7xl">
            <p
              className="text-sm font-bold uppercase tracking-[0.3em]"
              style={{ color: primary }}
            >
              Visual preview
            </p>

            <h2 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-[-0.05em] sm:text-7xl">
              A richer look
              <br />
              at the experience.
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-zinc-500">
              Demo imagery is used to present the website concept and visual direction.
              It is not presented as verified photography of {website.businessName}.
            </p>

            <div className="mt-12 grid auto-rows-[220px] gap-4 md:grid-cols-2 lg:grid-cols-4">
              {galleryItems.map((item: any, index: number) => (
                <figure
                  key={`${item.url}-${index}`}
                  className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] ${
                    index === 0
                      ? "md:col-span-2 md:row-span-2"
                      : index === 3
                        ? "lg:col-span-2"
                        : ""
                  }`}
                >
                  <img
                    src={item.url}
                    alt={`${categoryName} demo visual ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.28em]"
                      style={{ color: primary }}
                    >
                      Demo visual {String(index + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section
          id="faq"
          className={`px-5 ${sectionSpacing}`}
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p
                className="text-sm font-bold uppercase tracking-[0.3em]"
                style={{ color: primary }}
              >
                Need to know
              </p>

              <h2 className="mt-5 text-5xl font-black tracking-[-0.04em] sm:text-7xl">
                Questions,
                <br />
                answered.
              </h2>
            </div>

            <div className="mt-16 space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={`${item.question}-${index}`}
                  className="premium-glass overflow-hidden rounded-3xl"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index ? null : index
                      )
                    }
                    className="flex w-full items-center justify-between gap-6 p-6 text-left sm:p-7"
                  >
                    <span className="text-lg font-bold">
                      {item.question}
                    </span>

                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        color: primary,
                        background: `${primary}15`,
                      }}
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition ${
                          openFaq === index
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </button>

                  {openFaq === index && (
                    <div className="px-6 pb-7 sm:px-7">
                      <p className="max-w-3xl leading-relaxed text-zinc-500">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        id="contact"
        className={`relative px-5 ${sectionSpacing}`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent, ${primary}0f)`,
          }}
        />

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[44px] border border-white/10 bg-white/[0.04]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <p
                className="text-sm font-bold uppercase tracking-[0.3em]"
                style={{ color: primary }}
              >
                Let's connect
              </p>

              <h2 className="mt-6 text-5xl font-black leading-none tracking-[-0.05em] sm:text-7xl">
                Talk directly
                <br />
                with us.
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-500">
                Contact {website.businessName} for current
                products, services, availability and business
                enquiries.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {contact.phone && (
                  <a
                    href={phoneHref}
                    className="flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-black text-black transition hover:-translate-y-1"
                    style={{ background: primary }}
                  >
                    <Phone className="h-5 w-5" />

                    Call Now
                  </a>
                )}

                {(contact.whatsapp || contact.phone) && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="premium-glass flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-bold transition hover:bg-white/[0.08]"
                  >
                    <MessageCircle className="h-5 w-5" />

                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/20 p-8 sm:p-12 lg:border-l lg:border-t-0 lg:p-16">
              <div className="space-y-8">
                {contact.address && (
                  <ContactItem
                    icon={MapPin}
                    title="Visit"
                    value={contact.address}
                    color={primary}
                  />
                )}

                {contact.phone && (
                  <ContactItem
                    icon={Phone}
                    title="Call"
                    value={contact.phone}
                    color={primary}
                  />
                )}

                {contact.email && (
                  <ContactItem
                    icon={Mail}
                    title="Email"
                    value={contact.email}
                    color={primary}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <div className="flex items-center gap-3">
            {website.logoSvg && (
              <div
                className="h-10 w-10 [&>svg]:h-full [&>svg]:w-full"
                dangerouslySetInnerHTML={{
                  __html: website.logoSvg,
                }}
              />
            )}

            <div>
              <p className="font-black">
                {website.businessName}
              </p>

              <p className="text-xs text-zinc-600">
                {contact.city ||
                  business.city ||
                  categoryName}
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-600">
            © {new Date().getFullYear()}{" "}
            {website.businessName}. All rights reserved.
          </p>

          <p className="text-xs text-zinc-700">
            Website preview
          </p>
        </div>
      </footer>

      {(contact.whatsapp || contact.phone) && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Contact on WhatsApp"
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-white shadow-2xl transition hover:-translate-y-1 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}

      {/* Sticky Agency CTA for the Client */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-700 text-white p-3 sm:p-4 z-[100] flex flex-col sm:flex-row items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/20 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center pulse-glow hidden sm:flex">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base">This is a custom AI demo for {website.businessName}</div>
            <div className="text-xs text-white/90">Like what you see? Claim this exact website for your business today.</div>
          </div>
        </div>
        <a 
          href="/" 
          target="_blank"
          className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-all flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg"
        >
          Claim This Website <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </main>
  );
}

function FeatureBadge({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  color: string;
}) {
  return (
    <div className="premium-glass rounded-2xl p-4">
      <Icon
        className="mb-3 h-5 w-5"
      />

      <span
        className="text-xs font-semibold text-zinc-300 sm:text-sm"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-5">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
        style={{
          color,
          background: `${color}15`,
          border: `1px solid ${color}25`,
        }}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
          {title}
        </p>

        <p className="mt-2 break-words font-semibold text-zinc-300">
          {value}
        </p>
      </div>
    </div>
  );
}