// src/components/SuccessPage.tsx
import { FiCheck, FiExternalLink, FiPlusCircle } from "react-icons/fi";
import type { Request } from "../types";
import { MAIN_CATEGORIES } from "../constants";
import Header from "./Header";

interface SuccessPageProps {
  request: Request;
  onSubmitAnother: () => void;
  onViewHistory: () => void;
  onGoHome: () => void;
}

export default function SuccessPage({
  request,
  onSubmitAnother,
  onViewHistory,
  onGoHome,
}: SuccessPageProps) {
  const mainCategory = MAIN_CATEGORIES.find((m) => m.id === request.mainCategory)!;
  const trackingId = String(request.id).slice(-6).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header onGoHome={onGoHome} onViewHistory={onViewHistory} />

      <main className="mx-auto max-w-2xl px-6 py-16 flex flex-col items-center text-center animate-fade-slide-up">
        {/* Animated checkmark */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center animate-bounce-in shadow-xl shadow-emerald-500/10">
            <FiCheck className="text-4xl text-emerald-400" />
          </div>
          <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping" />
        </div>

        <div className="mb-2 text-xs font-semibold text-emerald-400 tracking-widest uppercase">
          Request submitted
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">You're all set!</h1>
        <p className="text-slate-400 text-lg mb-8 max-w-md">
          Your report has been received and will be reviewed by the appropriate staff.
        </p>

        {/* Tracking ID */}
        <div className="w-full card p-5 mb-6 text-left">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Tracking Reference
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-wider">
            #{trackingId}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Save this number to follow up with your campus office
          </p>
        </div>

        {/* Summary */}
        <div className="w-full card p-5 mb-8 text-left space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Submission Summary
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-slate-500 text-xs mb-0.5">Campus</div>
              <div className="text-white font-medium">{request.campus}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-0.5">Submitted by</div>
              <div className="text-white font-medium">
                {request.isAnonymous ? "Anonymous" : request.name}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-0.5">Category</div>
              <div className="flex items-center gap-1.5 text-white font-medium">
                <div
                  className={`inline-flex w-5 h-5 items-center justify-center rounded-md flex-shrink-0 ${mainCategory.color}`}
                >
                  <mainCategory.icon className="text-xs text-white" />
                </div>
                {mainCategory.title}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-0.5">Type</div>
              <div className="text-white font-medium">{request.subCategory}</div>
            </div>
          </div>

          {request.location && (
            <div className="text-sm">
              <div className="text-slate-500 text-xs mb-0.5">Location</div>
              <div className="text-white">{request.location}</div>
            </div>
          )}

          <div className="text-sm">
            <div className="text-slate-500 text-xs mb-0.5">Description</div>
            <div className="text-slate-300 leading-relaxed line-clamp-3">
              {request.description}
            </div>
          </div>

          {request.isPriority && (
            <div className="inline-flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-full px-3 py-1">
              ⚠ Marked as Urgent
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onSubmitAnother}
            className="btn-primary flex-1 py-3.5"
          >
            <FiPlusCircle />
            Submit Another
          </button>
          <button
            onClick={onViewHistory}
            className="btn-outline flex-1 py-3.5"
          >
            <FiExternalLink />
            View Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
