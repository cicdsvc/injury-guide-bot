import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HomeButton } from "@/components/app/HomeButton";
import { Disclaimer } from "@/components/app/Disclaimer";
import { TermsOfUse } from "@/components/app/TermsOfUse";
import { ArrowLeft, Download, FileText, Loader2, RefreshCcw } from "lucide-react";
import { ResumePrompt } from "@/components/app/ResumePrompt";
import {
  clearProgress,
  loadProgress,
  saveProgress,
  type ProgressKey,
} from "@/lib/progress";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  rows?: number;
  help?: string;
  options?: string[];
  showIf?: (data: Record<string, string>) => boolean;
};

export type LetterWizardProps = {
  title: string;
  description: React.ReactNode;
  image: string;
  imageAlt: string;
  fields: FieldDef[];
  buildPreview: (data: Record<string, string>) => string;
  onGenerate: (data: Record<string, string>, format: "docx" | "pdf") => Promise<void>;
  progressKey: ProgressKey;
  requireTerms?: boolean;
};

type SavedLetter = {
  formData: Record<string, string>;
  step: "intro" | "form" | "preview";
  savedAt?: string;
};

export function LetterWizard({
  title,
  description,
  image,
  imageAlt,
  fields,
  buildPreview,
  onGenerate,
  progressKey,
  requireTerms = false,
}: LetterWizardProps) {
  const [step, setStep] = useState<"intro" | "form" | "preview" | "done">("intro");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [savedDraft, setSavedDraft] = useState<SavedLetter | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    let active = true;
    loadProgress<SavedLetter>(progressKey).then((saved) => {
      if (!active) return;
      const hasAnswers =
        saved?.formData &&
        Object.values(saved.formData).some((v) => typeof v === "string" && v.trim() !== "");
      if (hasAnswers) setSavedDraft(saved);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [progressKey]);

  useEffect(() => {
    if (!ready || savedDraft) return;
    const hasAnswers = Object.values(formData).some((v) => v && v.trim() !== "");
    if (!hasAnswers) return;
    void saveProgress(progressKey, {
      formData,
      step: step === "done" ? "preview" : step,
      savedAt: new Date().toISOString(),
    });
  }, [formData, step, ready, savedDraft, progressKey]);

  const visibleFields = fields.filter((f) => !f.showIf || f.showIf(formData));

  const updateField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (format: "docx" | "pdf") => {
    setIsGenerating(true);
    setError(null);
    try {
      await onGenerate(formData, format);
      setStep("done");
    } catch (err) {
      setError("Failed to generate the document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={image}
              alt={imageAlt}
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground">Letter builder</p>
            </div>
          </div>
          <HomeButton />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <Disclaimer />

        {!ready && (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {ready && savedDraft && (
          <ResumePrompt
            description="You have a saved draft of this letter. Continue with your saved answers, or start a new draft."
            savedAt={
              savedDraft.savedAt
                ? new Date(savedDraft.savedAt).toLocaleString()
                : undefined
            }
            onResume={() => {
              setFormData(savedDraft.formData);
              setStep(savedDraft.step === "intro" ? "form" : savedDraft.step);
              setSavedDraft(null);
            }}
            onRestart={() => {
              void clearProgress(progressKey);
              setFormData({});
              setStep("intro");
              setSavedDraft(null);
            }}
          />
        )}

        {ready && !savedDraft && step === "intro" && (

          <Card className="mt-6 overflow-hidden border-border/60 bg-card">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={image}
                alt={imageAlt}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-2xl font-bold">{title}</h2>
              </div>
            </div>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4 text-foreground/90 leading-relaxed">{description}</div>
              {requireTerms && (
                <TermsOfUse
                  accepted={termsAccepted}
                  onAcceptedChange={setTermsAccepted}
                  variant="purple"
                />
              )}
              <Button onClick={() => setStep("form")} disabled={requireTerms && !termsAccepted} className="gap-2">
                <FileText className="h-4 w-4" />
                Start drafting
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "form" && (
          <Card className="mt-6 border-border/60 bg-card">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("intro")}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <h2 className="text-lg font-semibold">Answer a few questions</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Your answers will be used to fill in the letter template.
              </p>

              <div className="grid gap-5">
                {visibleFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </Label>
                    {field.help && (
                      <p className="text-xs text-muted-foreground">{field.help}</p>
                    )}
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        rows={field.rows ?? 4}
                        value={formData[field.name] ?? ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.name}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={formData[field.name] ?? field.options?.[0] ?? ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                      >
                        {(field.options ?? []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={field.name}
                        type="text"
                        placeholder={field.placeholder}
                        value={formData[field.name] ?? ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep("preview")} className="gap-2">
                  Preview letter
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "preview" && (
          <Card className="mt-6 border-border/60 bg-card">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("form")}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Edit answers
                </Button>
                <h2 className="text-lg font-semibold">Preview</h2>
              </div>

              <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-border/60 bg-background p-6 text-sm">
                <pre className="whitespace-pre-wrap font-serif text-[13px] leading-relaxed">
                  {buildPreview(formData)}
                </pre>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("form")}
                  disabled={isGenerating}
                >
                  Back
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => void handleGenerate("pdf")}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => void handleGenerate("docx")}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Download Word (.docx)"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "done" && (
          <Card className="mt-6 border-border/60 bg-card text-center">
            <CardContent className="space-y-5 p-8">
              <div className="mx-flex mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold">Your letter is ready</h2>
              <p className="text-muted-foreground">
                The document has been downloaded. Word files can be edited in Microsoft
                Word or Google Docs; PDFs are ready to print or send.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    void clearProgress(progressKey);
                    setFormData({});
                    setStep("intro");
                  }}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Start over
                </Button>
                <HomeButton />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
