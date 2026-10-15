import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-start justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={label} className="flex items-start gap-2">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border-2",
                  active && "bg-primary border-primary text-primary-foreground",
                  done && "bg-success border-success text-success-foreground",
                  !active && !done && "bg-muted border-border text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              <div
                className={cn(
                  "mt-2 text-xs font-medium",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="h-0.5 w-12 mt-4 bg-border" />
            )}
          </div>
        );
      })}
    </div>
  );
}
