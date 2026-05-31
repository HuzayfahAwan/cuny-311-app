// src/components/CampusSelector.tsx
import { useState } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import type { Campus } from "../types";
import { CAMPUSES } from "../constants";
import Header from "./Header";
import StepProgress from "./StepProgress";

interface CampusSelectorProps {
  onCampusSelect: (campus: Campus) => void;
  onGoHome: () => void;
  onViewHistory: () => void;
}

export default function CampusSelector({
  onCampusSelect,
  onGoHome,
  onViewHistory,
}: CampusSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = CAMPUSES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header onGoHome={onGoHome} onViewHistory={onViewHistory} />
      <StepProgress currentStep={1} />

      <main className="mx-auto max-w-6xl px-6 py-10 animate-fade-slide-up">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
            <FiMapPin />
            Step 1 of 4
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Select your campus
          </h2>
          <p className="text-slate-400">
            Choose the CUNY campus where this issue, concern, or suggestion applies.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campuses..."
            className="input-dark pl-11"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <FiSearch className="text-4xl mx-auto mb-3 opacity-40" />
            <p>No campuses match "{search}"</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-600 mb-4">
              {filtered.length === CAMPUSES.length
                ? `${CAMPUSES.length} campuses`
                : `${filtered.length} of ${CAMPUSES.length} campuses`}
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((campus) => (
                <button
                  key={campus}
                  onClick={() => onCampusSelect(campus)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:border-blue-500/50 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 active:scale-95"
                >
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    <span className="leading-snug">{campus}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
