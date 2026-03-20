import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useAssessment } from "@/contexts/AssessmentContext";
import { SECTIONS } from "@/lib/types";

type ComplianceStatus = "compliant" | "non-compliant" | "needs-review";

type LegacySectionImageAIReviewResult = {
  compliance_status: ComplianceStatus;
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
  description: string;
  diagnosis: string;
  relevance: string;
  issues: string; // bullet list separated by "•"
  improvements: string;
  severityIndicator: SeverityIndicator;
  captions: string[];
};

type TopicResult = TopicRelevantFalseResult | TopicRelevantTrueResult;

type Props = {
  sectionId: string;
  sectionName: string;
};

function getSectionSubject(stepIndex: number): string {
  if (stepIndex === 1) return "property exterior and identification";
  if (stepIndex === 2) return "gas meter, regulator, and supply point";
  if (stepIndex === 3) return "internal gas pipework and fittings";
  if (stepIndex === 4) return "gas shutoff valves";
  if (stepIndex === 6) return "ventilation grilles and combustion air openings";
  if (stepIndex === 7) return "flue pipes, terminals, and gas evacuation components";
  if (stepIndex === 8) return "CO detectors, emergency controls, and safety signage";
  return "the section-relevant gas installation subject";
}

function severityBadgeClasses(severity: SeverityIndicator): string {
  switch (severity) {
    case "Satisfactory":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "Advisory":
      return "border-blue-200 bg-blue-50 text-blue-800";
    case "Improvement Required":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "Immediately Dangerous":
      return "border-red-200 bg-red-50 text-red-800";
    case "Cannot Determine":
      return "border-gray-200 bg-gray-50 text-gray-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

export function SectionImageAIReview({ sectionId, sectionName }: Props) {
  const { state } = useAssessment();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [legacyResult, setLegacyResult] = useState<LegacySectionImageAIReviewResult | null>(null);
  const [topicResult, setTopicResult] = useState<TopicRelevantTrueResult | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [lastAnalyzedLang, setLastAnalyzedLang] = useState<"pt" | "en">("pt");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sectionNumber =
    SECTIONS.find((s) => s.id === sectionId)?.number ?? 0;
  const sectionSubject = getSectionSubject(sectionNumber);

  const sectionAnswersForApi = useMemo(() => {
    switch (sectionId) {
      case "property":
        return state.data.property;
      case "gasSupply":
        return state.data.gasSupply;
      case "piping":
        return state.data.piping;
      case "valves":
        return state.data.valves;
      case "appliances":
        return state.data.appliances;
      case "ventilation":
        return state.data.ventilation;
      case "flue":
        return state.data.flue;
      case "safety":
        return state.data.safety;
      case "observations":
        return state.data.observations;
      default:
        return null;
    }
  }, [sectionId, state.data]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setLegacyResult(null);
    setTopicResult(null);
    setRejectionReason(null);
    setError(null);

    const objectUrl = URL.createObjectURL(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  };

  const statusBadge = useMemo(() => {
    if (topicResult) {
      const severity: SeverityIndicator =
        (topicResult.severityIndicator as SeverityIndicator) ?? "Cannot Determine";
      return (
        <span
          className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${severityBadgeClasses(
            severity
          )}`}
        >
          {severity}
        </span>
      );
    }

    if (!legacyResult) return null;

    let label = "";
    let variant: "default" | "secondary" | "destructive" = "secondary";

    if (legacyResult.compliance_status === "compliant") {
      label = "Compliant";
      variant = "default";
    } else if (legacyResult.compliance_status === "non-compliant") {
      label = "Non-compliant";
      variant = "destructive";
    } else {
      label = "Needs review";
      variant = "secondary";
    }

    return <Badge variant={variant}>{label}</Badge>;
  }, [legacyResult, topicResult]);

  const clearFileInputAndPreview = () => {
    setFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async (forcedLang?: "pt" | "en") => {
    const requestLang = forcedLang ?? lang;

    if (!file) {
      setError("Please select an image before running AI review.");
      return;
    }

    setLoading(true);
    setError(null);
    setLegacyResult(null);
    setTopicResult(null);
    setRejectionReason(null);

    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type || "image/jpeg";

      const base64Clean = base64.replace(/^data:[^;]+;base64,/, "");

      const res = await fetch("/api/ai/section-image-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64Clean,
          mimeType,
          sectionId,
          sectionName,
          lang: requestLang,
          sectionAnswers: sectionAnswersForApi,
        }),
      });

      if (!res.ok) {
        const data = await safeJson(res);
        throw new Error(
          (data as any)?.error ||
            `AI request failed with status ${res.status}.`
        );
      }

      const data = (await res.json()) as any;

      if (typeof data?.topicRelevant === "boolean") {
        if (data.topicRelevant === false) {
          setRejectionReason(
            typeof data?.rejectionReason === "string" &&
              data.rejectionReason.trim()
              ? data.rejectionReason
              : (requestLang === "pt"
                  ? "Esta imagem não está relacionada com esta secção do inquérito"
                  : "This image is not related to this survey section")
          );

          // Clear file input + preview so user can re-upload.
          clearFileInputAndPreview();
          return;
        }

        setTopicResult(data as TopicRelevantTrueResult);
        setLastAnalyzedLang(requestLang);
        return;
      }

      // Legacy schema fallback (appliances=5, observations=9)
      setLegacyResult(data as LegacySectionImageAIReviewResult);
      setLastAnalyzedLang(requestLang);
    } catch (err: any) {
      console.error("[AI] section image review error:", err);
      setError(
        err?.message ||
          "Failed to run AI image review. Please try again or check the server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-dashed border-border rounded-lg p-4 space-y-3 bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            AI Image Review
          </p>
          <p className="text-xs text-muted-foreground">
            Upload a focused photo for this section. AI will suggest issues and
            recommendations, but you remain responsible for the final judgment.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {statusBadge}
          {(legacyResult || topicResult) && (
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => {
                  const nextLang = "pt" as const;
                  setLang(nextLang);
                  if (topicResult && lastAnalyzedLang !== nextLang) {
                    void handleAnalyze(nextLang);
                  }
                }}
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  lang === "pt"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextLang = "en" as const;
                  setLang(nextLang);
                  if (topicResult && lastAnalyzedLang !== nextLang) {
                    void handleAnalyze(nextLang);
                  }
                }}
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                EN
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => void handleAnalyze()}
            disabled={loading || !file}
          >
            {loading && <Spinner />}
            {loading ? "Analyzing..." : "Analyze Image"}
          </Button>
          {error && (
            <p className="text-xs text-destructive max-w-sm">{error}</p>
          )}
        </div>

        {previewUrl && (
          <div className="ml-auto">
            <img
              src={previewUrl}
              alt="Section preview"
              className="w-32 h-32 object-cover rounded-md border border-border"
            />
          </div>
        )}
      </div>

      {rejectionReason && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 space-y-1">
          <div className="font-semibold text-sm">
            {lang === "pt"
              ? "⚠️ Esta imagem não está relacionada com esta secção do inquérito"
              : "⚠️ This image is not related to this survey section"}
          </div>
          <div className="text-sm leading-relaxed">{rejectionReason}</div>
          <div className="text-sm">
            {lang === "pt"
              ? `Por favor envie uma fotografia de ${sectionSubject}`
              : `Please upload a photo of ${sectionSubject}`}
          </div>
        </div>
      )}

      {topicResult && (
        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <p className="font-medium">{lang === "pt" ? "Descrição" : "Description"}</p>
            <p className="text-muted-foreground">
              {topicResult.description || (lang === "pt" ? "—" : "—")}
            </p>
          </div>

          {/* Diagnosis prominently between description and relevance */}
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="font-medium mb-1">{lang === "pt" ? "Diagnóstico" : "Diagnosis"}</p>
            <p className="text-muted-foreground">
              {topicResult.diagnosis || (lang === "pt" ? "—" : "—")}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-medium">{lang === "pt" ? "Relevância" : "Relevance"}</p>
            <p className="text-muted-foreground">
              {topicResult.relevance || (lang === "pt" ? "—" : "—")}
            </p>
          </div>

          {topicResult.issues?.trim() && (
            <div className="space-y-1">
              <p className="font-medium text-sm">{lang === "pt" ? "Problemas" : "Issues"}</p>
              <ul className="list-disc list-inside text-muted-foreground">
                {topicResult.issues
                  .split("•")
                  .map((s, i) => s.trim())
                  .filter(Boolean)
                  .map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
              </ul>
            </div>
          )}

          <div className="space-y-1">
            <p className="font-medium text-sm">{lang === "pt" ? "Melhorias" : "Improvements"}</p>
            <p className="text-muted-foreground">
              {topicResult.improvements || (lang === "pt" ? "—" : "—")}
            </p>
          </div>

          {Array.isArray(topicResult.captions) && topicResult.captions.length > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-sm">{lang === "pt" ? "Legendas" : "Captions"}</p>
              {topicResult.captions.slice(0, 2).map((cap, i) => (
                <p key={i} className="text-muted-foreground">
                  {cap}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {legacyResult && !topicResult && (
        <div className="space-y-2 text-sm">
          <p className="font-medium">
            {lang === "pt" ? "Avaliação global" : "Overall assessment"}
          </p>
          <p className="text-muted-foreground">
            {lang === "pt"
              ? legacyResult.overall_assessment_pt
              : legacyResult.overall_assessment_en}
          </p>

          {(lang === "pt"
            ? legacyResult.issues_pt?.length
            : legacyResult.issues_en?.length) > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {lang === "pt" ? "Problemas identificados" : "Issues noticed"}
              </p>
              <ul className="list-disc list-inside text-muted-foreground">
                {(lang === "pt" ? legacyResult.issues_pt : legacyResult.issues_en).map(
                  (issue, i) => (
                    <li key={i}>{issue}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {(lang === "pt"
            ? legacyResult.recommendations_pt?.length
            : legacyResult.recommendations_en?.length) > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {lang === "pt" ? "Recomendações" : "Recommendations"}
              </p>
              <ul className="list-disc list-inside text-muted-foreground">
                {(
                  lang === "pt"
                    ? legacyResult.recommendations_pt
                    : legacyResult.recommendations_en
                ).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

