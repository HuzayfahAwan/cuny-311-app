// src/components/StepProgress.tsx
import { FiCheck } from "react-icons/fi";

interface StepProgressProps {
  currentStep: 1 | 2 | 3 | 4;
  campus?: string;
  category?: string;
}

const STEPS = [
  { n: 1, label: "Campus" },
  { n: 2, label: "Category" },
  { n: 3, label: "Type" },
  { n: 4, label: "Details" },
] as const;

export default function StepProgress({ currentStep, campus, category }: StepProgressProps) {
  return (
    <div className="border-b border-white/10 bg-slate-900/40 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = s.n < currentStep;
            const active = s.n === currentStep;
            return (
              <div key={s.n} className="flex items-center gap-2 flex-1 last:flex-none">
                {/* Step dot */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                      ${done ? "bg-blue-600 text-white" : ""}
                      ${active ? "bg-blue-600 text-white ring-2 ring-blue-400/40 ring-offset-2 ring-offset-slate-950" : ""}
                      ${!done && !active ? "bg-slate-800 text-slate-500 border border-white/10" : ""}
                    `}
                  >
                    {done ? <FiCheck className="text-xs" /> : s.n}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block transition-colors ${
                      active ? "text-white" : done ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {s.n === 1 && done && campus ? campus.split(" ")[0] : s.label}
                  </span>
                  {s.n === 2 && done && category && (
                    <span className="text-xs text-slate-500 hidden md:block truncate max-w-24">
                      {category}
                    </span>
                  )}
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 transition-colors ${
                      done ? "bg-blue-600" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
