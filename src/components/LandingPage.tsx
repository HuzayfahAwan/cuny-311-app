// src/components/LandingPage.tsx
import { FiArrowRight, FiGrid, FiZap } from "react-icons/fi";
import { MAIN_CATEGORIES } from "../constants";

interface LandingPageProps {
  onStartReport: () => void;
  onViewHistory: () => void;
}

export default function LandingPage({ onStartReport, onViewHistory }: LandingPageProps) {
  return (
    <div
      className="min-h-screen text-white overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(59,130,246,0.22) 0%, transparent 65%), #020617",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/University_Name_Correct_Logo_Usage3.png"
              alt="CUNY"
              className="h-9 w-auto"
            />
            <div>
              <div className="text-base font-bold leading-tight">CUNY 311</div>
              <div className="text-[10px] text-slate-500 tracking-wider uppercase leading-tight">
                Campus Portal
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onViewHistory} className="btn-ghost text-sm hidden sm:flex">
              <FiGrid className="text-slate-400" />
              Dashboard
            </button>
            <button
              onClick={onStartReport}
              className="btn-primary text-sm px-5 py-2"
            >
              Report Issue
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-20 text-center animate-fade-slide-up">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-300 rounded-full px-4 py-1.5 text-sm font-medium mb-10">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Serving all 26 CUNY campuses
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-7">
          Campus Issues,
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Resolved.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Report maintenance problems, tech outages, safety concerns, and more.
          Fast, trackable, anonymous if needed — for every CUNY student and staff.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartReport}
            className="btn-primary text-lg px-10 py-4 shadow-lg shadow-blue-500/20 w-full sm:w-auto"
          >
            Report an Issue
            <FiArrowRight />
          </button>
          <button
            onClick={onViewHistory}
            className="btn-outline text-lg px-10 py-4 w-full sm:w-auto"
          >
            View Dashboard
          </button>
        </div>
      </main>

      {/* Stats bar */}
      <div className="relative z-10 border-y border-white/10 bg-slate-900/40 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="mx-auto max-w-4xl px-6 py-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white mb-1">26</div>
            <div className="text-sm text-slate-400">CUNY Campuses</div>
          </div>
          <div className="border-x border-white/10">
            <div className="text-4xl font-extrabold text-white mb-1">5</div>
            <div className="text-sm text-slate-400">Issue Categories</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white mb-1">24/7</div>
            <div className="text-sm text-slate-400">Always Open</div>
          </div>
        </div>
      </div>

      {/* Category showcase */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 animate-fade-in" style={{ animationDelay: "0.35s" }}>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">What can we help with?</h2>
          <p className="text-slate-400">Select a category to get started</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={onStartReport}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-left hover:border-white/25 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <div
                className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${cat.color}`}
              />
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${cat.color}`}>
                  <cat.icon className="text-xl text-white" />
                </div>
                <div className="text-sm font-semibold text-white leading-tight mb-1">
                  {cat.title}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {cat.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <FiZap className="text-blue-400" />
            CUNY 311 — Campus Issue Portal
          </div>
          <div className="text-xs text-slate-600">
            Report · Track · Resolve · Improve
          </div>
        </div>
      </footer>
    </div>
  );
}
