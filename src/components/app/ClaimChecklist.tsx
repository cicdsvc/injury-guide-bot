import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

type Step = { title: string; items: (string | { text: string; sub: string[] })[] };

const STEPS: Step[] = [
  {
    title: "Step 1: Assess the situation immediately after sustaining an injury",
    items: [
      "Gather evidence",
      "Identify potential witnesses",
      "Identify the correct party to take action against",
      "Report the incident",
    ],
  },
  {
    title: "Step 2: Find out who the other party is",
    items: [
      "Identify the correct person or company – there may be more than one",
    ],
  },
  {
    title: "Step 3: Ascertaining whether you have a case",
    items: [
      "Did someone owe you a duty of care?",
      "Did they breach that duty by being careless?",
      "Did their breach cause your injury?",
      "Is the damage reasonably foreseeable?",
      "Are you within the time limit to make a claim?",
      "Did you partially cause the injury?",
    ],
  },
  {
    title: "Step 4: Ascertaining how much you can claim",
    items: [
      "What injuries did you suffer?",
      "What is the ballpark figure to claim for the injuries suffered?",
      "Any factors that can affect the amount of compensation for pain and suffering claimable?",
      "Did you incur any financial losses?",
      "Are there any ongoing or future expenses related to your injury?",
    ],
  },
  {
    title: "Step 5: Preparing your case",
    items: [
      "Collect evidence to show the other party was at fault",
      "Collect evidence to support your claim amount",
    ],
  },
  {
    title: "Step 6: Writing a Letter of Claim",
    items: [
      "Prepare and send your Letter of Claim",
      "Make use of the template provided if necessary",
    ],
  },
  {
    title: "Step 7: Negotiating and drafting a settlement",
    items: [
      "Negotiate openly and politely with the other party, using evidence to support your claim",
      "Consider all offers openly",
      {
        text: "Finalising and drafting the Settlement Agreement (making use of the template provided if necessary), ensuring you cover the following:",
        sub: [
          "Timing of payment",
          "Method of payment",
          "Finality of the settlement (i.e. after the agreement is signed, neither party can back out of it or ask to change it)",
          "Signing of the agreement",
        ],
      },
    ],
  },
  {
    title: "Step 8: Receiving payment",
    items: [
      "Keep clear and complete records of payments (monitor schedule if payment is to be made in instalments)",
      "If the other party does not pay, send a reminder, or a formal letter to demand payment",
    ],
  },
];

export function ClaimChecklist({ onClose }: { onClose?: () => void }) {
  return (
    <Card className="mt-6 border-border/60 bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Checklist – Your Personal Injuries Claim Process
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Section IV. Resources, Part A of the guide
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close checklist">
            <X className="size-4" />
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        A simple checklist to help you keep track of the important steps involved in making a
        personal injury claim on your own — from deciding if you have a claim to finalising your
        settlement.
      </p>

      <div className="mt-5 space-y-5">
        {STEPS.map((step) => (
          <div key={step.title}>
            <h3 className="text-sm font-medium text-foreground">{step.title}</h3>
            <ul className="mt-2 space-y-1.5">
              {step.items.map((item) => {
                const text = typeof item === "string" ? item : item.text;
                return (
                  <li key={text} className="text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{text}</span>
                    </div>
                    {typeof item !== "string" && (
                      <ul className="ml-6 mt-1.5 list-disc space-y-1 pl-4">
                        {item.sub.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-lg border border-border/60 bg-secondary p-3 text-xs font-medium text-secondary-foreground">
        IMPORTANT: Consult a lawyer when in doubt at any stage, and also to review the documents
        you have drafted.
      </p>
    </Card>
  );
}
