import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HomeButton } from "@/components/app/HomeButton";
import { Disclaimer } from "@/components/app/Disclaimer";
import { ArrowLeft, Download, FileText, Loader2, RefreshCcw } from "lucide-react";

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
  description: string;
  image: string;
  imageAlt: string;
  fields: FieldDef[];
  buildPreview: (data: Record<string, string>) => string;
  onGenerate: (data: Record<string, string>) => Promise<void>;
};

export function LetterWizard({
  title,
  description,
  image,
  imageAlt,
  fields,
  onGenerate,
}: LetterWizardProps) {
  const [step, setStep] = useState<"intro" | "form" | "preview" | "done">("intro");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await onGenerate(formData);
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

        {step === "intro" && (
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
              <p className="text-foreground/90 leading-relaxed">{description}</p>
              <Button onClick={() => setStep("form")} className="gap-2">
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
                {fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        rows={field.rows ?? 4}
                        value={formData[field.name] ?? ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                      />
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
                <LetterPreview fields={fields} data={formData} />
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
                <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Download .docx"}
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
                The document has been downloaded. You can open it in Microsoft Word
                or Google Docs to make further edits.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
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

function LetterPreview({
  fields,
  data,
}: {
  fields: FieldDef[];
  data: Record<string, string>;
}) {
  return (
    <div className="space-y-4 whitespace-pre-wrap">
      {fields.map((field) => (
        <div key={field.name}>
          <p className="font-semibold text-muted-foreground">{field.label}</p>
          <p>{data[field.name] || "—"}</p>
        </div>
      ))}
      <p className="text-xs text-muted-foreground italic">
        (Full formatted letter will be generated in the downloaded .docx file.)
      </p>
    </div>
  );
}
