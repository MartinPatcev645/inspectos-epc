import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.warn(
    "[AI] GOOGLE_API_KEY is not set. /api/ai/section-image-review will return errors."
  );
}

const genAI = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;
const model = genAI
  ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  : null;

type SectionImageReviewBody = {
  imageBase64?: string;
  mimeType?: string;
  sectionId?: string;
  sectionName?: string;
};

type SectionImageReviewResult = {
  compliance_status: "compliant" | "non-compliant" | "needs-review";
  issues_pt: string[];
  issues_en: string[];
  recommendations_pt: string[];
  recommendations_en: string[];
  overall_assessment_pt: string;
  overall_assessment_en: string;
};

function buildPrompt(sectionName: string, sectionId: string): string {
  return `
You are an expert Portuguese gas installation inspector using the InspectOS Gas app.

You are reviewing ONE photograph related to this inspection section:
Section ID: ${sectionId}
Section Name: ${sectionName}

Analyze only what is visible in the image. Focus on gas safety and Portuguese regulations (DL 97/2017, Lei 59/2018, RT-RIGP).

Your goals:
- Describe briefly what the photo shows, in inspection language.
- Identify any visible non-compliances, risks, damage, or accessibility issues.
- Suggest clear, practical recommendations for the inspector.

IMPORTANT:
- If the situation appears clearly OK from the photo, choose "compliant".
- If you see clear non-compliance or obvious risk, choose "non-compliant".
- If you cannot be sure from the photo alone, or visibility is limited, choose "needs-review".
- You are assisting a professional inspector. Be conservative and safety-focused.

You MUST respond with a JSON object ONLY, no markdown, no backticks.
The JSON must have EXACTLY these keys and types and NOTHING ELSE.
Write BOTH Portuguese and English versions, already translated:

{
  "compliance_status": "compliant" | "non-compliant" | "needs-review",
  "issues_pt": string[],                // bullet-style issues in European Portuguese
  "issues_en": string[],                // same issues in English
  "recommendations_pt": string[],       // recommendations in European Portuguese
  "recommendations_en": string[],       // same recommendations in English
  "overall_assessment_pt": string,      // short paragraph in European Portuguese
  "overall_assessment_en": string       // same paragraph in English
}

- The Portuguese and English content must describe the SAME findings.
- Do not include any other keys.
- Do not include comments or explanations outside the JSON.
`;
}

async function callSectionImageReviewAI(
  body: SectionImageReviewBody
): Promise<SectionImageReviewResult> {
  if (!GOOGLE_API_KEY || !model) {
    throw new Error("GOOGLE_API_KEY is not set on the server.");
  }

  const { imageBase64, mimeType, sectionId, sectionName } = body;

  if (!imageBase64 || !mimeType || !sectionId || !sectionName) {
    throw new Error(
      "Missing required fields: imageBase64, mimeType, sectionId, sectionName."
    );
  }

  const prompt = buildPrompt(sectionName, sectionId);

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    },
  ]);

  const rawText = result.response.text();

  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("[AI] Failed to parse AI response as JSON:", rawText);
    throw new Error("Failed to parse AI response as JSON.");
  }

  const {
    compliance_status,
    issues_pt,
    issues_en,
    recommendations_pt,
    recommendations_en,
    overall_assessment_pt,
    overall_assessment_en,
  } = parsed ?? {};

  const allowedStatus = ["compliant", "non-compliant", "needs-review"];

  if (!allowedStatus.includes(compliance_status)) {
    throw new Error(
      'Invalid "compliance_status" from AI. Expected "compliant" | "non-compliant" | "needs-review".'
    );
  }

  if (!Array.isArray(issues_pt) || !Array.isArray(issues_en)) {
    throw new Error('"issues_pt" and "issues_en" must be arrays of strings.');
  }

  if (
    !Array.isArray(recommendations_pt) ||
    !Array.isArray(recommendations_en)
  ) {
    throw new Error(
      '"recommendations_pt" and "recommendations_en" must be arrays of strings.'
    );
  }

  if (
    typeof overall_assessment_pt !== "string" ||
    typeof overall_assessment_en !== "string"
  ) {
    throw new Error(
      '"overall_assessment_pt" and "overall_assessment_en" must be strings.'
    );
  }

  return {
    compliance_status,
    issues_pt,
    issues_en,
    recommendations_pt,
    recommendations_en,
    overall_assessment_pt,
    overall_assessment_en,
  };
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "10mb" }));

  app.post(
    "/api/ai/section-image-review",
    async (req, res): Promise<void> => {
      const body = req.body as SectionImageReviewBody;

      try {
        const result = await callSectionImageReviewAI(body);
        res.json(result);
      } catch (err: any) {
        console.error("[AI] Error in section-image-review:", err);
        res.status(500).json({
          error:
            err?.message ||
            "Failed to generate AI section image review. Please try again.",
        });
      }
    }
  );

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
