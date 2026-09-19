import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

// Helper to extract a domain from a URL
function extractDomain(url: string) {
  try {
    const parsed = new URL(url);
    let domain = parsed.hostname;
    if (domain.startsWith("www.")) {
      domain = domain.substring(4);
    }
    return domain;
  } catch (e) {
    return url;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city")?.trim();
    const category = searchParams.get("category")?.trim();
    const source = searchParams.get("source")?.trim(); // 'linkedin' or 'web'

    if (!city || !category) {
      return NextResponse.json({ error: "City and category are required" }, { status: 400 });
    }

    let query = "";
    if (source === "linkedin") {
      query = `site:linkedin.com/company "${category}" "${city}"`;
    } else {
      query = `"${category}" in "${city}" website contact email`;
    }

    console.log("GLOBAL SEARCH QUERY:", query);

    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Search engine returned ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const businesses: any[] = [];
    const seenDomains = new Set<string>();

    $(".result").each((i, element) => {
      const titleEl = $(element).find(".result__title .result__a");
      const snippetEl = $(element).find(".result__snippet");
      const urlEl = $(element).find(".result__url");

      const title = titleEl.text().trim();
      let rawUrl = titleEl.attr("href") || urlEl.attr("href") || "";
      const snippet = snippetEl.text().trim();

      // DuckDuckGo often wraps URLs in a redirect like //duckduckgo.com/l/?uddg=https...
      if (rawUrl.includes("uddg=")) {
        try {
          const urlObj = new URL("https:" + rawUrl);
          const uddg = urlObj.searchParams.get("uddg");
          if (uddg) {
            rawUrl = decodeURIComponent(uddg);
          }
        } catch (e) {
          // fallback to rawUrl
        }
      }

      if (!title || !rawUrl) return;

      const domain = extractDomain(rawUrl);
      
      // Filter out junk domains or duplicates
      const ignoreDomains = ["justdial.com", "sulekha.com", "indiamart.com", "facebook.com", "instagram.com", "yelp.com", "tripadvisor.com"];
      if (ignoreDomains.some(d => domain.includes(d)) && source !== "linkedin") return;
      if (seenDomains.has(domain)) return;
      
      seenDomains.add(domain);

      // Extract potential emails from snippet
      const emailMatch = snippet.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
      const phoneMatch = snippet.match(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g);

      // Clean up business name
      let businessName = title;
      if (source === "linkedin") {
        businessName = businessName.replace(" | LinkedIn", "").replace(" - LinkedIn", "");
      } else {
        businessName = businessName.split(" - ")[0].split(" | ")[0];
      }

      businesses.push({
        osmId: `web-${Date.now()}-${i}`,
        businessName,
        category,
        city,
        address: city,
        website: rawUrl,
        hasWebsite: true,
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0] : null,
        metadata: {
          snippet,
          source: source === "linkedin" ? "linkedin" : "web_search",
        },
        latitude: null,
        longitude: null,
        media: { sourcePhotos: [], coverPhoto: null }
      });
    });

    console.log(`FOUND ${businesses.length} GLOBAL LEADS`);

    return NextResponse.json({
      businesses,
      total: businesses.length,
      city,
      category,
      source: "Global Web Search"
    });

  } catch (error: any) {
    console.error("GLOBAL SEARCH ERROR:", error);
    return NextResponse.json(
      { error: "Global search failed", details: error.message },
      { status: 500 }
    );
  }
}
