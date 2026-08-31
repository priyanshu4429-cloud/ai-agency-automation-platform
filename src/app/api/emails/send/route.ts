import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  emails,
  leads,
  activities,
  websites,
} from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import nodemailer from "nodemailer";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

async function generateWithGroq(prompt: string) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your-groq-api-key") {
    return null;
  }

  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("GROQ ERROR:", res.status, errorText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("GROQ FETCH ERROR:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const {
      leadId,
      templateId,
      customSubject,
      customBody,
    } = await req.json();

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

    const [website] = await db
      .select()
      .from(websites)
      .where(eq(websites.leadId, leadId))
      .orderBy(desc(websites.createdAt))
      .limit(1);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const demoUrl =
      website?.demoUrl ||
      (website?.slug
        ? `${appUrl}/demo/${website.slug}`
        : null);

    console.log("LEAD:", lead.businessName);
    console.log("DEMO URL:", demoUrl);

    let subject = customSubject?.trim();
    let body = customBody?.trim();

    if (!subject || !body) {
      const prompt = `
Write a personalized professional outreach email.

Business name:
${lead.businessName}

Business category:
${lead.category}

Business city:
${lead.city || "their city"}

We have already prepared a free website preview for this business.

Demo website URL:
${demoUrl || "Demo available on request"}

Requirements:

- Keep the email professional and friendly.
- Keep it under 150 words.
- Clearly mention the business name.
- Mention that we noticed their business.
- Explain that we created a free website preview.
- Include the demo website URL naturally if available.
- Explain that the preview is only a demo.
- Mention that a fully customized website can be created based on their branding, services and requirements.
- End with a simple call to action.
- Do not use markdown.
- Do not include code fences.

Return ONLY valid JSON using this exact structure:

{
  "subject": "Email subject",
  "body": "Email body"
}
`;

      const groqResponse = await generateWithGroq(prompt);

      try {
        const content =
          groqResponse?.choices?.[0]?.message?.content || "";

        if (content) {
          const parsed = JSON.parse(content);

          subject = parsed.subject?.trim();
          body = parsed.body?.trim();

          console.log("AI EMAIL GENERATED");
        }
      } catch (error) {
        console.error(
          "FAILED TO PARSE GROQ RESPONSE:",
          error
        );
      }
    }

    if (!subject) {
      subject = `Free Website Preview for ${lead.businessName}`;
    }

    if (!body) {
      body = `Hi ${lead.businessName} team,

I came across your ${lead.category} business in ${
        lead.city || "your city"
      } and wanted to reach out.

We prepared a free website preview for ${lead.businessName} to show how a modern online presence could look.

${
  demoUrl
    ? `View your free website preview here:

${demoUrl}`
    : "Your free website preview is ready."
}

This is only a demo preview. We can create a fully customized and professional website based on your branding, services, menu and business requirements.

Would you be interested in discussing a customized website for ${lead.businessName}?

Best regards,
AI Agency Team`;
    }

    const fromEmail =
      process.env.FROM_EMAIL ||
      process.env.SMTP_USER ||
      "noreply@aiagency.com";

    const toEmail = lead.email?.trim() || "";

    if (!toEmail) {
      return NextResponse.json(
        {
          error: "Lead email address is missing",
        },
        {
          status: 400,
        }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(
      process.env.SMTP_PORT || "587"
    );

    let emailStatus = "demo";

    const smtpConfigured =
      smtpHost &&
      smtpUser &&
      smtpPass &&
      smtpHost !== "smtp.example.com" &&
      !smtpUser.includes("your-") &&
      !smtpPass.includes("your-");

    if (smtpConfigured) {
      console.log(
        "SMTP configured. Sending real email..."
      );

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.verify();

      const mailInfo = await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject,
        text: body,
      });

      emailStatus = "sent";

      console.log("EMAIL SENT TO:", toEmail);
      console.log(
        "EMAIL MESSAGE ID:",
        mailInfo.messageId
      );
    } else {
      console.log("SMTP not configured.");
      console.log("Running email in DEMO MODE.");

      console.log({
        to: toEmail,
        subject,
        body,
        demoUrl,
      });
    }

    const [email] = await db
      .insert(emails)
      .values({
        leadId,
        subject,
        body,
        fromEmail,
        toEmail,
        status: emailStatus,
        templateId: templateId || null,
      })
      .returning();

    await db.insert(activities).values({
      leadId,
      userId: user.id,
      type: "email_sent",
      description:
        emailStatus === "sent"
          ? `Email sent: ${subject}`
          : `Email demo created: ${subject}`,
      metadata: {
        emailId: email.id,
        demoUrl,
        status: emailStatus,
      },
    });

    return NextResponse.json({
      success: true,
      email,
      demoUrl,
    });
  } catch (error: any) {
    console.error("SEND EMAIL ERROR:", error);

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
        error: "Failed to send email",
        details:
          error?.message || "Unknown email error",
      },
      {
        status: 500,
      }
    );
  }
}