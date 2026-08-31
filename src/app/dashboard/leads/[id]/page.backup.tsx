import {
  NextRequest,
  NextResponse,
} from "next/server";

import { db } from "@/db";

import {
  leads,
  activities,
  notes,
  tasks,
  websites,
  emails,
} from "@/db/schema";

import { requireAuth } from "@/lib/auth";

import {
  desc,
  eq,
} from "drizzle-orm";

// ======================================================
// TYPES
// ======================================================

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ======================================================
// HELPERS
// ======================================================

function parseLeadId(id: string) {
  const leadId = Number(id);

  if (
    !Number.isInteger(leadId) ||
    leadId <= 0
  ) {
    return null;
  }

  return leadId;
}

function getErrorMessage(
  error: unknown
) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

function isUnauthorizedError(
  error: unknown
) {
  return (
    getErrorMessage(error) ===
    "Unauthorized"
  );
}

// ======================================================
// GET SINGLE LEAD
// GET /api/leads/[id]
// ======================================================

export async function GET(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    await requireAuth();

    const params =
      await context.params;

    const leadId =
      parseLeadId(params.id);

    console.log(
      "GET SINGLE LEAD REQUEST:",
      {
        rawId: params.id,
        leadId,
      }
    );

    if (!leadId) {
      console.warn(
        "INVALID LEAD ID:",
        params.id
      );

      return NextResponse.json(
        {
          error:
            "Invalid lead ID",

          lead: null,

          activities: [],

          notes: [],

          tasks: [],

          websites: [],

          emails: [],
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // FETCH LEAD
    // ==================================================

    const leadResult =
      await db
        .select()
        .from(leads)
        .where(
          eq(
            leads.id,
            leadId
          )
        )
        .limit(1);

    const lead =
      leadResult[0] || null;

    if (!lead) {
      console.warn(
        "LEAD NOT FOUND IN DATABASE:",
        {
          leadId,
        }
      );

      return NextResponse.json(
        {
          error:
            "Lead not found",

          lead: null,

          activities: [],

          notes: [],

          tasks: [],

          websites: [],

          emails: [],
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "LEAD FOUND:",
      {
        id: lead.id,

        businessName:
          lead.businessName,

        category:
          lead.category,
      }
    );

    // ==================================================
    // FETCH RELATED DATA
    // ==================================================

    const [
      leadActivities,
      leadNotes,
      leadTasks,
      leadWebsites,
      leadEmails,
    ] = await Promise.all([
      db
        .select()
        .from(activities)
        .where(
          eq(
            activities.leadId,
            leadId
          )
        )
        .orderBy(
          desc(
            activities.createdAt
          )
        ),

      db
        .select()
        .from(notes)
        .where(
          eq(
            notes.leadId,
            leadId
          )
        )
        .orderBy(
          desc(
            notes.createdAt
          )
        ),

      db
        .select()
        .from(tasks)
        .where(
          eq(
            tasks.leadId,
            leadId
          )
        )
        .orderBy(
          desc(
            tasks.createdAt
          )
        ),

      db
        .select()
        .from(websites)
        .where(
          eq(
            websites.leadId,
            leadId
          )
        )
        .orderBy(
          desc(
            websites.updatedAt
          )
        ),

      db
        .select()
        .from(emails)
        .where(
          eq(
            emails.leadId,
            leadId
          )
        )
        .orderBy(
          desc(
            emails.sentAt
          )
        ),
    ]);

    // ==================================================
    // SUCCESS LOG
    // ==================================================

    console.log(
      "SINGLE LEAD DATA LOADED:",
      {
        leadId,

        businessName:
          lead.businessName,

        activities:
          leadActivities.length,

        notes:
          leadNotes.length,

        tasks:
          leadTasks.length,

        websites:
          leadWebsites.length,

        emails:
          leadEmails.length,
      }
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return NextResponse.json(
      {
        lead,

        activities:
          leadActivities,

        notes:
          leadNotes,

        tasks:
          leadTasks,

        websites:
          leadWebsites,

        emails:
          leadEmails,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(
      "GET SINGLE LEAD ERROR:",
      error
    );

    const message =
      getErrorMessage(error);

    if (
      isUnauthorizedError(error)
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",

          lead: null,

          activities: [],

          notes: [],

          tasks: [],

          websites: [],

          emails: [],
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to fetch lead",

        details:
          message,

        lead: null,

        activities: [],

        notes: [],

        tasks: [],

        websites: [],

        emails: [],
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// UPDATE SINGLE LEAD
// PATCH /api/leads/[id]
// ======================================================

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const user =
      await requireAuth();

    const params =
      await context.params;

    const leadId =
      parseLeadId(params.id);

    if (!leadId) {
      return NextResponse.json(
        {
          error:
            "Invalid lead ID",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await req.json();

    // ==================================================
    // FETCH EXISTING LEAD
    // ==================================================

    const existingLeadResult =
      await db
        .select()
        .from(leads)
        .where(
          eq(
            leads.id,
            leadId
          )
        )
        .limit(1);

    const existingLead =
      existingLeadResult[0] ||
      null;

    if (!existingLead) {
      return NextResponse.json(
        {
          error:
            "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==================================================
    // UPDATE DATA
    // ==================================================

    const updateData:
      Partial<
        typeof leads.$inferInsert
      > = {
        updatedAt:
          new Date(),
      };

    // ==================================================
    // BUSINESS NAME
    // ==================================================

    if (
      body.businessName !==
      undefined
    ) {
      const businessName =
        typeof body.businessName ===
        "string"
          ? body.businessName.trim()
          : "";

      if (businessName) {
        updateData.businessName =
          businessName;
      }
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    if (
      body.category !==
      undefined
    ) {
      const category =
        typeof body.category ===
        "string"
          ? body.category.trim()
          : "";

      if (category) {
        updateData.category =
          category;
      }
    }

    // ==================================================
    // ADDRESS
    // ==================================================

    if (
      body.address !==
      undefined
    ) {
      updateData.address =
        typeof body.address ===
          "string"
          ? body.address.trim() ||
            null
          : null;
    }

    // ==================================================
    // CITY
    // ==================================================

    if (
      body.city !==
      undefined
    ) {
      updateData.city =
        typeof body.city ===
          "string"
          ? body.city.trim() ||
            null
          : null;
    }

    // ==================================================
    // STATE
    // ==================================================

    if (
      body.state !==
      undefined
    ) {
      updateData.state =
        typeof body.state ===
          "string"
          ? body.state.trim() ||
            null
          : null;
    }

    // ==================================================
    // COUNTRY
    // ==================================================

    if (
      body.country !==
      undefined
    ) {
      updateData.country =
        typeof body.country ===
          "string"
          ? body.country.trim() ||
            null
          : null;
    }

    // ==================================================
    // POSTAL CODE
    // ==================================================

    if (
      body.postalCode !==
      undefined
    ) {
      updateData.postalCode =
        typeof body.postalCode ===
          "string"
          ? body.postalCode.trim() ||
            null
          : null;
    }

    // ==================================================
    // PHONE
    // ==================================================

    if (
      body.phone !==
      undefined
    ) {
      updateData.phone =
        typeof body.phone ===
          "string"
          ? body.phone.trim() ||
            null
          : null;
    }

    // ==================================================
    // EMAIL
    // ==================================================

    if (
      body.email !==
      undefined
    ) {
      updateData.email =
        typeof body.email ===
          "string"
          ? body.email.trim() ||
            null
          : null;
    }

    // ==================================================
    // WEBSITE
    // ==================================================

    if (
      body.website !==
      undefined
    ) {
      const website =
        typeof body.website ===
          "string"
          ? body.website.trim() ||
            null
          : null;

      updateData.website =
        website;

      updateData.hasWebsite =
        Boolean(website);
    }

    // ==================================================
    // LATITUDE
    // ==================================================

    if (
      body.latitude !==
      undefined
    ) {
      updateData.latitude =
        body.latitude === null ||
        body.latitude === ""
          ? null
          : String(
              body.latitude
            );
    }

    // ==================================================
    // LONGITUDE
    // ==================================================

    if (
      body.longitude !==
      undefined
    ) {
      updateData.longitude =
        body.longitude === null ||
        body.longitude === ""
          ? null
          : String(
              body.longitude
            );
    }

    // ==================================================
    // OSM ID
    // ==================================================

    if (
      body.osmId !==
      undefined
    ) {
      updateData.osmId =
        body.osmId === null ||
        body.osmId === ""
          ? null
          : String(
              body.osmId
            );
    }

    // ==================================================
    // STATUS
    // ==================================================

    const validStatuses = [
      "new",
      "contacted",
      "demo_sent",
      "follow_up",
      "negotiation",
      "won",
      "lost",
    ] as const;

    if (
      body.status !==
      undefined
    ) {
      if (
        !validStatuses.includes(
          body.status
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid lead status",
          },
          {
            status: 400,
          }
        );
      }

      updateData.status =
        body.status;
    }

    // ==================================================
    // REVENUE
    // ==================================================

    if (
      body.revenue !==
      undefined
    ) {
      if (
        body.revenue === null ||
        body.revenue === ""
      ) {
        updateData.revenue =
          null;
      } else {
        const revenue =
          Number(
            body.revenue
          );

        if (
          !Number.isFinite(
            revenue
          )
        ) {
          return NextResponse.json(
            {
              error:
                "Invalid revenue",
            },
            {
              status: 400,
            }
          );
        }

        updateData.revenue =
          Math.round(revenue);
      }
    }

    // ==================================================
    // TAGS
    // ==================================================

    if (
      body.tags !==
      undefined
    ) {
      updateData.tags =
        Array.isArray(
          body.tags
        )
          ? body.tags
              .filter(
                (
                  tag: unknown
                ): tag is string =>
                  typeof tag ===
                  "string"
              )
              .map(
                (
                  tag: string
                ) =>
                  tag.trim()
              )
              .filter(Boolean)
          : null;
    }

    // ==================================================
    // METADATA
    // ==================================================

    if (
      body.metadata !==
        undefined ||
      body.whatsapp !==
        undefined ||
      body.businessDescription !==
        undefined
    ) {
      const existingMetadata =
        existingLead.metadata &&
        typeof existingLead.metadata ===
          "object" &&
        !Array.isArray(
          existingLead.metadata
        )
          ? (
              existingLead.metadata as Record<
                string,
                unknown
              >
            )
          : {};

      const incomingMetadata =
        body.metadata &&
        typeof body.metadata ===
          "object" &&
        !Array.isArray(
          body.metadata
        )
          ? (
              body.metadata as Record<
                string,
                unknown
              >
            )
          : {};

      updateData.metadata = {
        ...existingMetadata,

        ...incomingMetadata,

        ...(body.whatsapp !==
        undefined
          ? {
              whatsapp:
                typeof body.whatsapp ===
                  "string"
                  ? body.whatsapp.trim() ||
                    null
                  : null,
            }
          : {}),

        ...(body.businessDescription !==
        undefined
          ? {
              businessDescription:
                typeof body.businessDescription ===
                  "string"
                  ? body.businessDescription.trim() ||
                    null
                  : null,
            }
          : {}),
      };
    }

    // ==================================================
    // UPDATE DATABASE
    // ==================================================

    const updatedLeadResult =
      await db
        .update(leads)
        .set(updateData)
        .where(
          eq(
            leads.id,
            leadId
          )
        )
        .returning();

    const updatedLead =
      updatedLeadResult[0] ||
      null;

    if (!updatedLead) {
      return NextResponse.json(
        {
          error:
            "Lead update failed",
        },
        {
          status: 500,
        }
      );
    }

    // ==================================================
    // STATUS ACTIVITY
    // ==================================================

    if (
      body.status !==
        undefined &&
      body.status !==
        existingLead.status
    ) {
      await db
        .insert(activities)
        .values({
          leadId,

          userId:
            user.id,

          type:
            "status_changed",

          description:
            `Lead status changed from ${existingLead.status} to ${updatedLead.status}`,

          metadata: {
            previousStatus:
              existingLead.status,

            newStatus:
              updatedLead.status,
          },
        });
    }

    console.log(
      "LEAD UPDATED:",
      {
        leadId,

        businessName:
          updatedLead.businessName,

        status:
          updatedLead.status,
      }
    );

    return NextResponse.json(
      {
        message:
          "Lead updated successfully",

        lead:
          updatedLead,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(
      "UPDATE LEAD ERROR:",
      error
    );

    const message =
      getErrorMessage(error);

    if (
      isUnauthorizedError(error)
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to update lead",

        details:
          message,
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// DELETE SINGLE LEAD
// DELETE /api/leads/[id]
// ======================================================

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    await requireAuth();

    const params =
      await context.params;

    const leadId =
      parseLeadId(params.id);

    if (!leadId) {
      return NextResponse.json(
        {
          error:
            "Invalid lead ID",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // CHECK LEAD
    // ==================================================

    const existingLeadResult =
      await db
        .select()
        .from(leads)
        .where(
          eq(
            leads.id,
            leadId
          )
        )
        .limit(1);

    const existingLead =
      existingLeadResult[0] ||
      null;

    if (!existingLead) {
      return NextResponse.json(
        {
          error:
            "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "DELETING LEAD:",
      {
        leadId,

        businessName:
          existingLead.businessName,
      }
    );

    // ==================================================
    // DELETE CHILD RECORDS
    // ==================================================

    await db.transaction(
      async (tx) => {
        await tx
          .delete(activities)
          .where(
            eq(
              activities.leadId,
              leadId
            )
          );

        await tx
          .delete(notes)
          .where(
            eq(
              notes.leadId,
              leadId
            )
          );

        await tx
          .delete(tasks)
          .where(
            eq(
              tasks.leadId,
              leadId
            )
          );

        await tx
          .delete(emails)
          .where(
            eq(
              emails.leadId,
              leadId
            )
          );

        await tx
          .delete(websites)
          .where(
            eq(
              websites.leadId,
              leadId
            )
          );

        await tx
          .delete(leads)
          .where(
            eq(
              leads.id,
              leadId
            )
          );
      }
    );

    console.log(
      "LEAD DELETED:",
      {
        leadId,

        businessName:
          existingLead.businessName,
      }
    );

    return NextResponse.json(
      {
        message:
          "Lead deleted successfully",

        deletedLeadId:
          leadId,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(
      "DELETE LEAD ERROR:",
      error
    );

    const message =
      getErrorMessage(error);

    if (
      isUnauthorizedError(error)
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to delete lead",

        details:
          message,
      },
      {
        status: 500,
      }
    );
  }
}
