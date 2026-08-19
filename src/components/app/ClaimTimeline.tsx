import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LogIn, RefreshCcw } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { loadProgress, saveProgress } from "@/lib/progress";

const STAGES = [
  "Use the step-by-step guide to generate a draft Letter of Claim.",
  "Consult a lawyer to get proper legal advice on your situation.",
  "Negotiate with the other party to reach a resolution.",
  "An agreement is reached. Draft a Settlement Agreement and have a lawyer review it.",
  "The agreed compensation is not received by the deadline. Draft and send a Letter of Demand to the other party.",
];

type TimelineState = { done: boolean[] };

const EMPTY: boolean[] = STAGES.map(() => false);

export function ClaimTimeline() {
  const { user, loading } = useAuthUser();
  const [done, setDone] = useState<boolean[]>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    if (loading) return;
    if (!user) {
      setDone(EMPTY);
      setReady(true);
      return;
    }
    loadProgress<TimelineState>("timeline").then((saved) => {
      if (!active) return;
      if (saved?.done && Array.isArray(saved.done)) {
        setDone(STAGES.map((_, i) => Boolean(saved.done[i])));
      }
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [user, loading]);

  const persist = (next: boolean[]) => {
    setDone(next);
    if (user) void saveProgress("timeline", { done: next });
  };

  const toggle = (index: number) => {
    persist(done.map((v, i) => (i === index ? !v : v)));
  };

  const completed = done.filter(Boolean).length;

  return (
    <Card className="border-border/60 bg-card">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Your claim journey
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tick off each stage as you go, so you always know where you are.
            </p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {completed} of {STAGES.length} done
          </span>
        </div>

        <ol className="mt-6 space-y-0">
          {STAGES.map((stage, i) => (
            <li key={stage} className="relative flex gap-4 pb-6 last:pb-0">
              {i < STAGES.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-4 top-9 h-[calc(100%-1.5rem)] w-px ${
                    done[i] ? "bg-success" : "bg-border"
                  }`}
                />
              )}
              <span
                className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                  done[i]
                    ? "border-success bg-success text-success-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <label
                className={`flex flex-1 cursor-pointer items-start gap-3 rounded-lg p-3 pt-1 transition-colors ${
                  done[i]
                    ? "bg-success/10 text-success"
                    : "bg-transparent text-foreground"
                }`}
              >
                <Checkbox
                  checked={done[i] ?? false}
                  onCheckedChange={() => toggle(i)}
                  disabled={!ready}
                  aria-label={`Mark stage ${i + 1} as done`}
                  className="mt-0.5 border-success/50 data-[state=checked]:border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground"
                />
                <span className={`text-sm ${done[i] ? "font-medium" : ""}`}>
                  {i === 0 ? (
                    <>
                      <Link
                        to="/guide"
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        Use the step-by-step guide
                      </Link>
                      {" to generate a draft Letter of Claim."}
                    </>
                  ) : (
                    stage
                  )}
                  {i === 2 && (
                    <>
                      {" "}
                      <Link
                        to="/faq"
                        search={{ ask: "Give me Negotiations and Practical Tips" }}
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        Get negotiation tips
                      </Link>
                    </>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {completed > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => persist(EMPTY)}
            >
              <RefreshCcw className="h-4 w-4" />
              Reset timeline
            </Button>
          )}
          {!loading && !user && (
            <Button asChild size="sm" variant="ghost" className="gap-2">
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                Sign in to save your progress
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
