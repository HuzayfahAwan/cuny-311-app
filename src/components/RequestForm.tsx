// src/components/RequestForm.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiAlertTriangle,
  FiSend,
  FiFileText,
} from "react-icons/fi";
import type { Campus, MainCategoryId, Request } from "../types";
import { MAIN_CATEGORIES } from "../constants";
import { validateEmail } from "../utils/validation";
import Header from "./Header";
import StepProgress from "./StepProgress";

interface RequestFormProps {
  campus: Campus;
  mainCategoryId: MainCategoryId;
  subCategory: string;
  onSubmit: (request: Omit<Request, "id" | "submittedAt" | "status">) => void;
  onBackToSubcategories: () => void;
  onGoHome: () => void;
  onViewHistory: () => void;
}

export default function RequestForm({
  campus,
  mainCategoryId,
  subCategory,
  onSubmit,
  onBackToSubcategories,
  onGoHome,
  onViewHistory,
}: RequestFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const mainCategory = MAIN_CATEGORIES.find((m) => m.id === mainCategoryId)!;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];
    if (!description.trim()) errors.push("Please provide a description of the issue.");
    if (!anonymous && !name.trim()) errors.push("Please enter your name or submit anonymously.");
    if (!anonymous && !email.trim()) errors.push("Email is required for non-anonymous submissions.");
    if (email.trim() && !validateEmail(email.trim())) errors.push("Please enter a valid email address.");

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    onSubmit({
      campus,
      mainCategory: mainCategoryId,
      subCategory,
      name: anonymous ? "Anonymous" : name.trim() || "Anonymous",
      isAnonymous: anonymous || !name.trim(),
      email: anonymous ? undefined : email.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim(),
      isPriority: priority,
    });

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header onGoHome={onGoHome} onViewHistory={onViewHistory} />
      <StepProgress currentStep={4} campus={campus} category={mainCategory.title} />

      <main className="mx-auto max-w-3xl px-6 py-10 animate-fade-slide-up">
        {/* Context header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
              <FiFileText />
              Step 4 of 4
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">Fill in details</h2>
            <div className="flex flex-wrap items-center gap-1.5 text-slate-400 text-sm">
              <span>{campus}</span>
              <span className="text-slate-600">→</span>
              <span className="flex items-center gap-1">
                <div className={`inline-flex w-5 h-5 items-center justify-center rounded-md ${mainCategory.color}`}>
                  <mainCategory.icon className="text-xs text-white" />
                </div>
                {mainCategory.title}
              </span>
              <span className="text-slate-600">→</span>
              <span className="text-white font-medium">{subCategory}</span>
            </div>
          </div>
          <button onClick={onBackToSubcategories} className="btn-ghost text-sm self-start">
            ← Change type
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="card p-6 space-y-5">
            {/* Anonymous toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-slate-900/40">
              <div>
                <div className="text-sm font-semibold text-white">Anonymous submission</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Your name and email won't be stored
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnonymous((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                  anonymous ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    anonymous ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Name & Email */}
            {!anonymous && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    <FiUser className="inline mr-1.5 text-slate-500" />
                    Your name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    <FiMail className="inline mr-1.5 text-slate-500" />
                    Contact email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.edu"
                    className="input-dark"
                  />
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <FiMapPin className="inline mr-1.5 text-slate-500" />
                Location{" "}
                <span className="text-slate-600 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Building, floor, room, or area"
                className="input-dark"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, when, and any relevant details that will help staff respond..."
                className="input-dark resize-none"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-600">Be as specific as possible</span>
                <span className={`text-xs ${description.length > 500 ? "text-rose-400" : "text-slate-600"}`}>
                  {description.length}/500
                </span>
              </div>
            </div>

            {/* Priority toggle */}
            <div
              onClick={() => setPriority((v) => !v)}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                priority
                  ? "border-rose-500/40 bg-rose-500/10"
                  : "border-white/10 bg-slate-900/40 hover:border-white/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  priority ? "bg-rose-500 border-rose-500" : "border-slate-600"
                }`}
              >
                {priority && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <FiAlertTriangle
                    className={`text-sm ${priority ? "text-rose-400" : "text-slate-500"}`}
                  />
                  <span
                    className={`text-sm font-semibold ${priority ? "text-rose-300" : "text-slate-300"}`}
                  >
                    Mark as urgent
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Needs immediate attention or poses a safety risk
                </p>
              </div>
            </div>
          </div>

          {/* Errors */}
          {formErrors.length > 0 && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 animate-fade-in">
              <ul className="space-y-1">
                {formErrors.map((err) => (
                  <li key={err} className="text-sm text-rose-300 flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-4 text-base shadow-lg shadow-blue-500/20"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FiSend />
                Submit Request
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
