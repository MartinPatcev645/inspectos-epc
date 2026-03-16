import { useState, useMemo, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

type ComplianceStatus = "compliant" | "non-compliant" | "needs-review";

type SectionImageAIReviewResult = {
  compliance_status: ComplianceStatus;
  issues_pt: string[];
  issues_en: string[];
  recommendations_pt: string[];
  recommendations_en: string[];
  overall_assessment_pt: string;
  overall_assessment_en: string;
};

type Props = {
  sectionId: string;
  sectionName: string;
};

export function SectionImageAIReview({ sectionId, sectionName }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SectionImageAIReviewResult | null>(null);
  const [lang, setLang] = useState<"pt" | "en">("pt");

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setResult(null);
    setError(null);

    const objectUrl = URL.createObjectURL(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  };

  const statusBadge = useMemo(() => {
    if (!result) return null;

    let label = "";
    let variant: "default" | "secondary" | "destructive" = "secondary";

    if (result.compliance_status === "compliant") {
      label = "Compliant";
      variant = "default";
    } else if (result.compliance_status === "non-compliant") {
      label = "Non-compliant";
      variant = "destructive";
    } else {
      label = "Needs review";
      variant = "secondary";
    }

    return <Badge variant={variant}>{label}</Badge>;
  }, [result]);

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image before running AI review.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

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
        }),
      });

      if (!res.ok) {
        const data = await safeJson(res);
        throw new Error(
          (data as any)?.error ||
            `AI request failed with status ${res.status}.`
        );
      }

      const data = (await res.json()) as SectionImageAIReviewResult;
      setResult(data);
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
          {result && (
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => setLang("pt")}
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
                onClick={() => setLang("en")}
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
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAnalyze}
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

      {result && (
        <div className="space-y-2 text-sm">
          <p className="font-medium">
            {lang === "pt" ? "Avaliação global" : "Overall assessment"}
          </p>
          <p className="text-muted-foreground">
            {lang === "pt"
              ? result.overall_assessment_pt
              : result.overall_assessment_en}
          </p>

          {(lang === "pt"
            ? result.issues_pt?.length
            : result.issues_en?.length) > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {lang === "pt" ? "Problemas identificados" : "Issues noticed"}
              </p>
              <ul className="list-disc list-inside text-muted-foreground">
                {(lang === "pt" ? result.issues_pt : result.issues_en).map(
                  (issue, i) => (
                    <li key={i}>{issue}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {(lang === "pt"
            ? result.recommendations_pt?.length
            : result.recommendations_en?.length) > 0 && (
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {lang === "pt"
                  ? "Recomendações"
                  : "Recommendations"}
              </p>
              <ul className="list-disc list-inside text-muted-foreground">
                {(
                  lang === "pt"
                    ? result.recommendations_pt
                    : result.recommendations_en
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

