import {
  NextRequest,
  NextResponse,
} from "next/server";

import { db } from "@/db";

import {
  leads,
  activities,
} from "@/db/schema";

import { requireAuth } from "@/lib/auth";

import { eq } from "drizzle-orm";

import {
  enrichBusiness,
  type BusinessEnrichmentInput,
} from "@/lib/business-enrichment";

export async function POST(
  req: NextRequest
) {
  try {
    const user = await requireAuth();

    const body = await req.json();

    const leadId = Number(body.leadId);

    if (
      !Number.isInteger(leadId) ||
      leadId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Valid leadId is required",
        },
        {
          status: 400,
        }
      );
    }

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) {
      return NextResponse.json(
        {
          error: "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    const enrichmentInput: BusinessEnrichmentInput =
      {
        businessName:
          lead.businessName,

        city:
          lead.city,

        state:
          lead.state,

        country:
          lead.country,

        category:
          lead.category,

        latitude:
          lead.latitude,

        longitude:
          lead.longitude,

        osmId:
          lead.osmId,
      };

    const enriched =
      await enrichBusiness(
        enrichmentInput
      );

    if (!enriched) {
      return NextResponse.json({
        message:
          "No safe exact business match found",

        enriched: false,

        lead,
      });
    }

    const existingMetadata =
      lead.metadata &&
      typeof lead.metadata === "object" &&
      !Array.isArray(lead.metadata)
        ? lead.metadata
        : {};

    const existingPhotos =
      Array.isArray(
        (
          existingMetadata as Record<
            string,
            unknown
          >
        ).sourcePhotos
      )
        ? (
            (
              existingMetadata as Record<
                string,
                unknown
              >
            ).sourcePhotos as unknown[]
          )
        : [];

    const mergedPhotos =
      enriched.sourcePhotos.length > 0
        ? enriched.sourcePhotos
        : existingPhotos;

    const updatedMetadata = {
      ...existingMetadata,

      sourcePhotos:
        mergedPhotos,

      coverPhoto:
        enriched.coverPhoto ||
        (
          existingMetadata as Record<
            string,
            unknown
          >
        ).coverPhoto ||
        null,

      enrichment: {
        matched: true,

        matchScore:
          enriched.matchScore,

        matchReason:
          enriched.matchReason,

        source:
          enriched.source,

        enrichedAt:
          new Date().toISOString(),
      },

      osmSourceTags:
        enriched.sourceTags,
    };

    const [updatedLead] = await db
      .update(leads)
      .set({
        address:
          enriched.address ||
          lead.address,

        city:
          enriched.city ||
          lead.city,

        state:
          enriched.state ||
          lead.state,

        country:
          enriched.country ||
          lead.country,

        postalCode:
          enriched.postalCode ||
          lead.postalCode,

        phone:
          enriched.phone ||
          lead.phone,

        email:
          enriched.email ||
          lead.email,

        website:
          enriched.website ||
          lead.website,

        hasWebsite: Boolean(
          enriched.website ||
          lead.website
        ),

        latitude:
          enriched.latitude ||
          lead.latitude,

        longitude:
          enriched.longitude ||
          lead.longitude,

        osmId:
          enriched.osmId ||
          lead.osmId,

        metadata:
          updatedMetadata,

        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId))
      .returning();

    await db
      .insert(activities)
      .values({
        leadId,

        userId: user.id,

        type: "website_detected",

        description:
          `Business source enrichment completed for ${lead.businessName}`,

        metadata: {
          source:
            enriched.source,

          matchScore:
            enriched.matchScore,

          matchReason:
            enriched.matchReason,

          sourcePhotoCount:
            enriched.sourcePhotos.length,

          websiteFound:
            Boolean(
              enriched.website
            ),
        },
      });

    return NextResponse.json({
      message:
        "Business enriched successfully",

      enriched: true,

      lead: updatedLead,

      enrichment: {
        matchScore:
          enriched.matchScore,

        matchReason:
          enriched.matchReason,

        source:
          enriched.source,

        sourcePhotoCount:
          enriched.sourcePhotos.length,

        coverPhoto:
          enriched.coverPhoto,

        websiteFound:
          Boolean(
            enriched.website
          ),
      },
    });
  } catch (error: unknown) {
    console.error(
      "BUSINESS ENRICHMENT API ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown enrichment error";

    if (message === "Unauthorized") {
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
        error:
          "Business enrichment failed",

        details: message,
      },
      {
        status: 500,
      }
    );
  }
}