// src/components/CategorySelector.tsx
import { FiTag } from "react-icons/fi";
import type { Campus, MainCategoryId } from "../types";
import { MAIN_CATEGORIES } from "../constants";
import Header from "./Header";
import StepProgress from "./StepProgress";

interface CategorySelectorProps {
  campus: Campus;
  onCategorySelect: (id: MainCategoryId) => void;
  onChangeCampus: () => void;
  onGoHome: () => void;
  onViewHistory: () => void;
}

export default function CategorySelector({
  campus,
  onCategorySelect,
  onChangeCampus,
  onGoHome,
  onViewHistory,
}: CategorySelectorProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header onGoHome={onGoHome} onViewHistory={onViewHistory} />
      <StepProgress currentStep={2} campus={campus} />

      <main className="mx-auto max-w-6xl px-6 py-10 animate-fade-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
              <FiTag />
              Step 2 of 4
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">
              What's the issue?
            </h2>
            <p className="text-slate-400">
              Reporting for{" "}
              <span className="text-white font-medium">{campus}</span>
            </p>
          </div>
          <button onClick={onChangeCampus} className="btn-ghost text-sm self-start">
            ← Change campus
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 p-7 text-left hover:border-white/25 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 active:scale-95"
              style={{ background: "rgba(15, 23, 42, 0.7)" }}
            >
              {/* Gradient fill on hover */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300 ${cat.color}`}
              />

              <div className="relative">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${cat.color} shadow-lg`}
                >
                  <cat.icon className="text-2xl text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {cat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-blue-400 transition-colors">
                  Select category
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
