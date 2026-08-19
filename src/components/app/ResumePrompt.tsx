import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { History, RefreshCcw } from "lucide-react";

export function ResumePrompt({
  title = "Welcome back",
  description = "We saved your progress from last time. Would you like to continue, or start again from the beginning?",
  savedAt,
  onResume,
  onRestart,
}: {
  title?: string;
  description?: string;
  savedAt?: string | undefined;
  onResume: () => void;
  onRestart: () => void;
}) {
  return (
    <Card className="mt-6 border-border/60 bg-card">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            {savedAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Last saved: {savedAt}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onResume} className="gap-2">
            <History className="h-4 w-4" />
            Pick up where I left off
          </Button>
          <Button variant="outline" onClick={onRestart} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Start over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
