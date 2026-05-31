// src/components/SubcategorySelector.tsx
import { FiLayers } from "react-icons/fi";
import type { Campus, MainCategoryId } from "../types";
import { MAIN_CATEGORIES, SUBCATEGORIES } from "../constants";
import Header from "./Header";
import StepProgress from "./StepProgress";

interface SubcategorySelectorProps {
  campus: Campus;
  mainCategoryId: MainCategoryId;
  onSubcategorySelect: (sub: string) => void;
  onBackToCategories: () => void;
  onGoHome: () => void;
  onViewHistory: () => void;
}

export default function SubcategorySelector({
  campus,
  mainCategoryId,
  onSubcategorySelect,
  onBackToCategories,
  onGoHome,
  onViewHistory,
}: SubcategorySelectorProps) {
  const mainCategory = MAIN_CATEGORIES.find((m) => m.id === mainCategoryId)!;
  const subcategories = SUBCATEGORIES[mainCategoryId];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header onGoHome={onGoHome} onViewHistory={onViewHistory} />
      <StepProgress currentStep={3} campus={campus} category={mainCategory.title} />

      <main className="mx-auto max-w-6xl px-6 py-10 animate-fade-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
              <FiLayers />
              Step 3 of 4
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">
              Choose a specific type
            </h2>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>{campus}</span>
              <span className="text-slate-600">→</span>
              <span className="flex items-center gap-1.5">
                <div className={`inline-flex w-5 h-5 items-center justify-center rounded-md ${mainCategory.color}`}>
                  <mainCategory.icon className="text-xs text-white" />
                </div>
                {mainCategory.title}
              </span>
            </div>
          </div>
          <button onClick={onBackToCategories} className="btn-ghost text-sm self-start">
            ← Back to categories
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => onSubcategorySelect(sub)}
              className="group rounded-xl border border-white/10 bg-slate-900/60 px-5 py-4 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:border-blue-500/40 hover:text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span>{sub}</span>
                <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
