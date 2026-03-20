import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_API_KEY =
  process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY_GAS;

if (!GOOGLE_API_KEY) {
  console.warn(
    "[AI] GOOGLE_API_KEY / GOOGLE_API_KEY_GAS is not set. /api/ai/section-image-review will return errors."
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
  lang?: "pt" | "en";
  sectionAnswers?: unknown;
};

type LegacySectionImageReviewResult = {
  compliance_status: "compliant" | "non-compliant" | "needs-review";
  issues_pt: string[];
  issues_en: string[];
  recommendations_pt: string[];
  recommendations_en: string[];
  overall_assessment_pt: string;
  overall_assessment_en: string;
};

type SeverityIndicator =
  | "Satisfactory"
  | "Advisory"
  | "Improvement Required"
  | "Immediately Dangerous"
  | "Cannot Determine";

type TopicRelevantFalseResult = {
  topicRelevant: false;
  rejectionReason: string;
};

type TopicRelevantTrueResult = {
  topicRelevant: true;
  description: string; // max 120 words
  diagnosis: string; // max 100 words
  relevance: string; // max 80 words
  issues: string; // bullet-style list separated by "•"
  improvements: string; // max 80 words
  severityIndicator: SeverityIndicator;
  captions: string[]; // [caption1, caption2]
};

type SectionImageReviewResult =
  | LegacySectionImageReviewResult
  | TopicRelevantFalseResult
  | TopicRelevantTrueResult;

function getSectionGuardConfig(sectionId: string) {
  const cfg: Record<
    string,
    {
      subject: string;
      relevanceDefinition: string;
    }
  > = {
    property: {
      subject: "property exterior and identification",
      relevanceDefinition:
        "Confirm or challenge stated building type, construction era, number of floors, gross area plausibility, general condition of the property. Note any visible features relevant to gas risk (e.g. proximity to vents, basement access, building materials near the gas entry point).",
    },
    gasSupply: {
      subject: "gas meter, regulator, and supply point",
      relevanceDefinition:
        "Focus on meter accessibility and condition (corrosion, damage, legibility of dials), regulator type and visible condition, supply pipe material and condition at entry, signs of interference/tampering/unsafe installation, and whether the meter location is appropriate and ventilated.",
    },
    piping: {
      subject: "internal gas pipework and fittings",
      relevanceDefinition:
        "Identify visible pipe material (copper, steel, CSST, PE), routing adequacy and compliance, pipe support/fixing quality, corrosion classification (surface/moderate/severe), joint integrity (compression/soldered/threaded), presence and accuracy of labeling; also note unsafe routing near heat sources or inadequate support.",
    },
    valves: {
      subject: "gas shutoff valves",
      relevanceDefinition:
        "Identify valve type (ball valve/cock/service valve), assess accessibility for emergency operation, operability indicators (handle position, corrosion, paint-over), correct labeling and flow direction marking, compliance with positioning requirements, and whether any valves are inaccessible, seized, or missing.",
    },
    ventilation: {
      subject: "ventilation grilles and combustion air openings",
      relevanceDefinition:
        "Assess adequacy of combustion air supply (grille size relative to appliance input), grille condition (blocked/damaged/correctly sized), general room ventilation quality, kitchen ventilation provision, and whether vents are sealed or obstructed; consider compliance with minimum free area requirements.",
    },
    flue: {
      subject: "flue pipes, terminals, and gas evacuation components",
      relevanceDefinition:
        "Classify flue type (open-flued, room-sealed, balanced, fan-assisted), assess visible material condition (rust, damage, joint integrity), evaluate terminal location compliance (proximity to windows, doors, corners), check for visible obstruction, and note correct rise and fall of horizontal runs; also note evidence of flue gas spillage (staining around terminal or appliance connection).",
    },
    safety: {
      subject: "CO detectors, emergency controls, and safety signage",
      relevanceDefinition:
        "Assess CO detector presence and positioning compliance (height, proximity to appliance), detector condition and in-date status, emergency control valve (ECV) accessibility and clear labelling, adequacy of safety signage, and any visible unsafe conditions that justify immediate action (e.g., combustibles/naked flame near gas components).",
    },
  };

  return cfg[sectionId] ?? null;
}

function buildLegacyPrompt(sectionName: string, sectionId: string): string {
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

function buildPrompt(
  sectionName: string,
  sectionId: string,
  lang: "pt" | "en",
  sectionAnswers: unknown
): string {
  const guardCfg = getSectionGuardConfig(sectionId);

  // Legacy sections: appliances (5) and observations (9) remain unchanged.
  if (!guardCfg) {
    return buildLegacyPrompt(sectionName, sectionId);
  }

  const inspectorAnswersBlock =
    sectionAnswers && typeof sectionAnswers === "object"
      ? `Inspector-entered answers for this section (may be incomplete):\n${JSON.stringify(
          sectionAnswers
        )}`
      : "Inspector-entered answers for this section: (none provided yet).";

  const languageInstruction =
    lang === "pt"
      ? "Write all narrative fields in European Portuguese."
      : "Write all narrative fields in English.";

  return `
You are a qualified Gas Safe registered engineer and accredited gas installation inspector with 20+ years of field experience. You are reviewing a site photograph submitted as part of a professional gas installation inspection report. Apply Gas Safe, IGE/UP/1, and EN standards-aligned assessment criteria. Use precise technical vocabulary. Do not speculate beyond what is visible. Where evidence is ambiguous, say so explicitly. Never fabricate details not present in the image.

You are reviewing ONE photograph related to this inspection section:
Section ID: ${sectionId}
Section Name: ${sectionName}

${inspectorAnswersBlock}

Analyze only what is visible in the image.

You MUST respond with a JSON object ONLY. No markdown fences. No preamble.
Output ONLY valid JSON. Do not include comments or explanations outside the JSON.

MANDATORY TOPIC RELEVANCE GUARD (first key)
Your response MUST ALWAYS begin with a JSON field:
"topicRelevant": true | false

Topic to focus on (this section):
${guardCfg.subject}

If the image shows anything other than "${guardCfg.subject}", set "topicRelevant" to false and do not complete the rest of the analysis.

"topicRelevant" is false definition (strict first-pass):
- A relevant image MUST show a physical gas installation component, pipe, fitting, appliance, or building element.
- Something directly observable and assessable by a gas safety inspector must be present.
- Content must match the specific section's scope.
- Reject if clearly unrelated: people, pets, vehicles, food, text documents, screenshots, logos, outdoor landscapes unrelated to gas infrastructure, indoor furniture only (no pipes/fittings/walls visible), or anything clearly unrelated.

If "topicRelevant" is false, the model must return ONLY:
{
  "topicRelevant": false,
  "rejectionReason": "<one sentence why the image is not relevant>"
}

If "topicRelevant" is true, the model must return ONLY this schema:
{
  "topicRelevant": true,
  "description": "Neutral, factual description of exactly what is visible. Use technical gas engineering vocabulary. Reference materials, component types, approximate dimensions if estimable, and location within the installation. Max 120 words.",
  "diagnosis": "Professional assessment of what the visual evidence indicates. Reference compliance status, safety classification, probable defect cause where applicable. Use hedged language where uncertain (e.g. 'consistent with', 'indicative of', 'warrants further investigation'). Max 100 words.",
  "relevance": "How this image relates specifically to this survey section. Cross-reference any inspector answers already recorded. Flag mismatches between stated answers and visual evidence. Max 80 words.",
  "issues": "Bullet-style list (in a single string, use • separator) of defects, non-compliances, safety concerns, or gaps visible in the image. Max 120 words.",
  "improvements": "What additional photographic angles, instrument readings, or physical investigations would strengthen the assessment for this section. Max 80 words.",
  "severityIndicator": "One of: Satisfactory | Advisory | Improvement Required | Immediately Dangerous | Cannot Determine — based only on what is visible in this image.",
  "captions": [
    "Report-ready caption 1 (professional, concise, past tense)",
    "Report-ready caption 2 (alternative angle or focus)"
  ]
}

${languageInstruction}

Temperature target for consistency: 0.2.
`;
}

async function callSectionImageReviewAI(
  body: SectionImageReviewBody
): Promise<SectionImageReviewResult> {
  if (!GOOGLE_API_KEY || !model) {
    throw new Error(
      "GOOGLE_API_KEY / GOOGLE_API_KEY_GAS is not set on the server."
    );
  }

  const { imageBase64, mimeType, sectionId, sectionName, lang = "pt", sectionAnswers } = body;

  if (!imageBase64 || !mimeType || !sectionId || !sectionName) {
    throw new Error(
      "Missing required fields: imageBase64, mimeType, sectionId, sectionName."
    );
  }

  const prompt = buildPrompt(sectionName, sectionId, lang, sectionAnswers);

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.2 },
  } as any);

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

  if (parsed && typeof parsed.topicRelevant === "boolean") {
    if (parsed.topicRelevant === false) {
      if (typeof parsed.rejectionReason !== "string") {
        throw new Error(
          'Invalid "rejectionReason" from AI. Expected string when topicRelevant=false.'
        );
      }
      return {
        topicRelevant: false,
        rejectionReason: parsed.rejectionReason,
      };
    }

    const allowedSev: SeverityIndicator[] = [
      "Satisfactory",
      "Advisory",
      "Improvement Required",
      "Immediately Dangerous",
      "Cannot Determine",
    ];

    if (typeof parsed.description !== "string") {
      throw new Error('Missing "description" from AI response.');
    }
    if (typeof parsed.diagnosis !== "string") {
      throw new Error('Missing "diagnosis" from AI response.');
    }
    if (typeof parsed.relevance !== "string") {
      throw new Error('Missing "relevance" from AI response.');
    }
    if (typeof parsed.issues !== "string") {
      throw new Error('Missing "issues" from AI response.');
    }
    if (typeof parsed.improvements !== "string") {
      throw new Error('Missing "improvements" from AI response.');
    }
    if (typeof parsed.severityIndicator !== "string") {
      throw new Error('Missing "severityIndicator" from AI response.');
    }
    if (!allowedSev.includes(parsed.severityIndicator)) {
      throw new Error(
        'Invalid "severityIndicator" from AI. Expected one of the allowed labels.'
      );
    }
    if (!Array.isArray(parsed.captions) || !parsed.captions.every((c: any) => typeof c === "string")) {
      throw new Error('Missing "captions" from AI response (string array required).');
    }

    return {
      topicRelevant: true,
      description: parsed.description,
      diagnosis: parsed.diagnosis,
      relevance: parsed.relevance,
      issues: parsed.issues,
      improvements: parsed.improvements,
      severityIndicator: parsed.severityIndicator,
      captions: parsed.captions,
    };
  }

  // Legacy schema fallback (appliances=5, observations=9)
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
