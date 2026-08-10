import { AlertTriangle } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="rounded-lg border border-amber/30 bg-amber/10 p-4 text-sm text-foreground/90">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-foreground" />
        <p>
          This app is for general information only and does not constitute legal
          advice. If you are unsure about your rights or next steps, please
          consult a qualified lawyer.
        </p>
      </div>
    </div>
  );
}
