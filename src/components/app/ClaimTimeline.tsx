import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LogIn, RefreshCcw, FileText, UserCheck, Handshake, FileSignature, Mail, Check, Flag } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthUser } from "@/hooks/useAuthUser";
import { clearProgress, loadProgress, saveProgress } from "@/lib/progress";
import type { SavedDocuments } from "@/lib/claim-documents";

const STAGES = [
  "Use the step-by-step guide to generate a draft Letter of Claim.",
  "Consult a lawyer to get proper legal advice on your situation.",
  "Negotiate with the other party to reach a resolution.",
  "An agreement is reached. Draft a Settlement Agreement and have a lawyer review it.",
  "The agreed compensation is not received by the deadline. Draft and send a Letter of Demand to the other party.",
];

const STAGE_ICONS = [FileText, UserCheck, Handshake, FileSignature, Mail];
const STAGE_LABELS = ["Draft", "Consult", "Negotiate", "Settle", "Demand"];

type TimelineState = { done: boolean[]; paymentReceived?: boolean | null };

const EMPTY: boolean[] = STAGES.map(() => false);

export function ClaimTimeline() {
  const { user, loading } = useAuthUser();
  const [done, setDone] = useState<boolean[]>(EMPTY);
  const [paymentReceived, setPaymentReceived] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [hasDocs, setHasDocs] = useState(false);
  const [hasSettlement, setHasSettlement] = useState(false);
  const [hasDemand, setHasDemand] = useState(false);

  useEffect(() => {
    let active = true;
    if (loading) return;
    if (!user) {
      setDone(EMPTY);
      setPaymentReceived(null);
      setReady(true);
      return;
    }
    void Promise.all([
      loadProgress<TimelineState>("timeline"),
      loadProgress<SavedDocuments>("documents"),
      loadProgress<SavedDocuments>("documents:settlement"),
      loadProgress<SavedDocuments>("documents:demand"),
    ]).then(([saved, savedDocs, savedSettlement, savedDemand]) => {
      if (!active) return;
      let next = saved?.done && Array.isArray(saved.done)
        ? STAGES.map((_, i) => Boolean(saved.done[i]))
        : [...EMPTY];
      const payment = saved?.paymentReceived ?? null;
      setPaymentReceived(payment);
      const docs = savedDocs?.docs ?? [];
      setHasDocs(docs.length > 0);
      setHasSettlement((savedSettlement?.docs ?? []).length > 0);
      setHasDemand((savedDemand?.docs ?? []).length > 0);
      if (docs.length > 0 && !next[0]) {
        next = next.map((v, i) => (i === 0 ? true : v));
        void saveProgress("timeline", { done: next, paymentReceived: payment });
      }
      setDone(next);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [user, loading]);

  const persist = (next: boolean[], payment: boolean | null = paymentReceived) => {
    setDone(next);
    setPaymentReceived(payment);
    if (user) void saveProgress("timeline", { done: next, paymentReceived: payment });
  };

  const answerPayment = (value: boolean | null) => {
    // Clearing stage 5 when payment is received keeps the journey honest.
    const next = value === true ? done.map((v, i) => (i === 4 ? false : v)) : done;
    persist(next, value);
  };

  const startNewProcess = () => {
    setDone(EMPTY);
    setPaymentReceived(null);
    setHasDocs(false);
    setHasSettlement(false);
    setHasDemand(false);
    if (user) {
      void Promise.all([
        clearProgress("timeline"),
        clearProgress("documents"),
        clearProgress("documents:settlement"),
        clearProgress("documents:demand"),
        clearProgress("faq"),
        clearProgress("letter:claim"),
        clearProgress("letter:settlement"),
        clearProgress("letter:demand"),
      ]);
    }
  };


  const toggle = (index: number) => {
    persist(done.map((v, i) => (i === index ? !v : v)));
  };

  const settledPath = paymentReceived === true && !hasDemand;
  const totalStages = settledPath ? 4 : STAGES.length;
  const completed = done.slice(0, totalStages).filter(Boolean).length;
  const progressPercent = Math.round((completed / totalStages) * 100);
  const allDone = completed === totalStages;


  return (
    <Card className="border-border/60 bg-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-navy-foreground">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Your claim journey
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tick off each stage as you go, so you always know where you are.
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              allDone
                ? "bg-success text-success-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {completed} of {totalStages} done
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick stage labels for larger screens */}
        <div className="mt-4 hidden sm:flex items-center justify-between gap-2">
          {STAGES.map((_, i) => {
            const Icon = STAGE_ICONS[i]!;
            const isDone = done[i];
            return (
              <div
                key={i}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                  isDone
                    ? "bg-success/10 text-success"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{STAGE_LABELS[i]}</span>
              </div>
            );
          })}
        </div>

        <ol className="mt-6 space-y-0">
          {STAGES.map((stage, i) => {
            const Icon = STAGE_ICONS[i]!;
            const isDone = done[i];
            return (
              <li key={stage} className="relative flex gap-4 pb-5 last:pb-0">
                {i < STAGES.length - 1 && (
                  <span
                    aria-hidden
                    className={`absolute left-5 top-10 h-[calc(100%-1.25rem)] w-0.5 rounded-full ${
                      isDone ? "bg-success" : "bg-border"
                    }`}
                  />
                )}
                <span
                  className={`z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    isDone
                      ? "border-success bg-success text-success-foreground"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <label
                  className={`group flex flex-1 cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                    isDone
                      ? "border-success/40 bg-success/8 text-foreground shadow-sm"
                      : "border-border/60 bg-card hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <Checkbox
                    checked={done[i] ?? false}
                    onCheckedChange={() => toggle(i)}
                    disabled={!ready}
                    aria-label={`Mark stage ${i + 1} as done`}
                    className="mt-0.5 border-success/50 data-[state=checked]:border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground"
                  />
                  <span className="text-sm leading-relaxed">
                    {i === 0 ? (
                      <>
                        <Link
                          to="/guide"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                        >
                          Draft a Letter of Claim
                        </Link>
                        {" using the step-by-step guide."}
                        {hasDocs && (
                          <>
                            {" "}
                            <Link
                              to="/documents"
                              onClick={(e) => e.stopPropagation()}
                              className="font-medium text-success underline underline-offset-2 hover:text-success/80"
                            >
                              View your documents
                            </Link>
                          </>
                        )}
                      </>
                    ) : i === 2 ? (
                      <>
                        {stage}{" "}
                        <Link
                          to="/faq"
                          search={{ ask: "Give me Negotiations and Practical Tips" }}
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                        >
                          Get negotiation tips
                        </Link>
                      </>
                    ) : i === 3 ? (
                      <>
                        An agreement is reached.{" "}
                        <Link
                          to="/letter/settlement"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                        >
                          Draft a Settlement Agreement
                        </Link>
                        {" and have a lawyer review it."}
                        {hasSettlement && (
                          <>
                            {" "}
                            <Link
                              to="/documents"
                              onClick={(e) => e.stopPropagation()}
                              className="font-medium text-success underline underline-offset-2 hover:text-success/80"
                            >
                              View your document
                            </Link>
                          </>
                        )}
                      </>
                    ) : i === 4 ? (
                      <>
                        The agreed compensation is not received by the deadline.{" "}
                        <Link
                          to="/letter/demand"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                        >
                          Draft a Letter of Demand
                        </Link>
                        {" and send to the other party."}
                        {hasDemand && (
                          <>
                            {" "}
                            <Link
                              to="/documents"
                              onClick={(e) => e.stopPropagation()}
                              className="font-medium text-success underline underline-offset-2 hover:text-success/80"
                            >
                              View your document
                            </Link>
                          </>
                        )}
                      </>
                    ) : (
                      stage
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ol>

        {allDone && (
          <div className="mt-5 rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-success">
            <div className="flex items-center gap-2 font-medium">
              <Check className="h-4 w-4" />
              You have completed all the stages of your claim journey.
            </div>
            <p className="mt-1 text-success/90">
              Remember to consult a lawyer before sending any legal documents or signing a settlement.
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {(completed > 0 || hasDocs || hasSettlement || hasDemand) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Start New Process
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start a new process?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Everything will be deleted, including your claim journey
                    progress, your saved conversation and all generated
                    documents. This cannot be undone. Download anything you want
                    to keep before continuing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={startNewProcess}>
                    OK, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
