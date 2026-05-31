// src/components/AdminDashboard.tsx
import { useMemo, useState } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiDownloadCloud,
  FiList,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiTrash2,
  FiAlertTriangle,
  FiLogOut,
  FiShield,
} from "react-icons/fi";
import type { AuthInfo, Campus, MainCategoryId, Request, RequestStatus, ToastType } from "../types";
import { CAMPUSES, MAIN_CATEGORIES, STATUS_ORDER } from "../constants";
import { exportToCSV } from "../utils/csv";
import { timeAgo } from "../utils/timeAgo";
import Header from "./Header";

interface AdminDashboardProps {
  requests: Request[];
  auth: AuthInfo;
  onStatusChange: (id: number, status: RequestStatus) => void;
  onCancelRequest: (id: number) => void;
  onDeleteRequest: (id: number) => void;
  onBackToStart: () => void;
  onViewHistory: () => void;
  onLogout: () => void;
  showToast: (msg: string, type?: ToastType) => void;
}

const STATUS_BADGE: Record<RequestStatus, string> = {
  Open: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  "In Progress": "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Resolved: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
  Cancelled: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

const CAT_BAR_COLORS: Record<string, string> = {
  campusFacilities: "bg-amber-500",
  techAccess: "bg-blue-500",
  safetyConduct: "bg-rose-500",
  campusLife: "bg-emerald-500",
  suggestions: "bg-violet-500",
};

export default function AdminDashboard({
  requests,
  auth,
  onStatusChange,
  onCancelRequest,
  onDeleteRequest,
  onBackToStart,
  onViewHistory,
  onLogout,
  showToast,
}: AdminDashboardProps) {
  const [filterCampus, setFilterCampus] = useState<Campus | "all">("all");
  const [filterMainCategory, setFilterMainCategory] = useState<MainCategoryId | "all">("all");
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const stats = useMemo(() => ({
    total: requests.length,
    open: requests.filter((r) => r.status === "Open").length,
    inProgress: requests.filter((r) => r.status === "In Progress").length,
    resolved: requests.filter((r) => r.status === "Resolved").length,
    urgent: requests.filter((r) => r.isPriority && r.status === "Open").length,
  }), [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (filterCampus !== "all" && r.campus !== filterCampus) return false;
      if (filterMainCategory !== "all" && r.mainCategory !== filterMainCategory) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        return (
          r.description.toLowerCase().includes(t) ||
          r.campus.toLowerCase().includes(t) ||
          r.subCategory.toLowerCase().includes(t) ||
          r.location?.toLowerCase().includes(t) ||
          r.name.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [requests, filterCampus, filterMainCategory, filterStatus, searchTerm]);

  const resetFilters = () => {
    setFilterCampus("all");
    setFilterMainCategory("all");
    setFilterStatus("all");
    setSearchTerm("");
    showToast("Filters cleared", "info");
  };

  const handleExportCSV = () => {
    exportToCSV(filteredRequests);
    showToast(`Exported ${filteredRequests.length} request(s) as CSV`, "success");
  };

  const handleDelete = (id: number) => {
    if (confirmDeleteId === id) {
      onDeleteRequest(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header onGoHome={onBackToStart} onViewHistory={onViewHistory} />

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8 animate-fade-slide-up">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-slate-400 text-sm mt-1">
              Track submissions, manage statuses, and export data
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Signed-in badge */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-white/10 rounded-lg px-3 py-2 text-sm">
              <FiShield className="text-blue-400 flex-shrink-0" />
              <span className="text-slate-300 font-medium">{auth.displayName}</span>
              <span className="text-slate-600 text-xs">({auth.username})</span>
            </div>
            <button onClick={handleExportCSV} className="btn-outline text-sm">
              <FiDownloadCloud />
              Export CSV
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-sm font-medium rounded-xl px-4 py-2.5 transition-all active:scale-95"
            >
              <FiLogOut />
              Sign out
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, icon: FiList, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Open", value: stats.open, icon: FiAlertCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "In Progress", value: stats.inProgress, icon: FiClock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "Resolved", value: stats.resolved, icon: FiCheckCircle, color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
          ].map((s) => (
            <div key={s.label} className={`stat-card border ${s.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </span>
                <s.icon className={`text-lg ${s.color}`} />
              </div>
              <div className="text-4xl font-extrabold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Category breakdown & urgent notice */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Category chart */}
          <div className="lg:col-span-2 card p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              By Category
            </h3>
            <div className="space-y-3">
              {MAIN_CATEGORIES.map((cat) => {
                const count = requests.filter((r) => r.mainCategory === cat.id).length;
                const pct = requests.length ? (count / requests.length) * 100 : 0;
                return (
                  <div key={cat.id} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${cat.color}`}
                    >
                      <cat.icon className="text-[10px] text-white" />
                    </div>
                    <span className="text-xs text-slate-400 w-36 truncate">{cat.title}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${CAT_BAR_COLORS[cat.id]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-5 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent notice */}
          {stats.urgent > 0 ? (
            <div className="card p-5 border-rose-500/20 bg-rose-500/5">
              <div className="flex items-center gap-2 mb-3">
                <FiAlertTriangle className="text-rose-400 text-lg" />
                <h3 className="text-sm font-semibold text-rose-300">
                  Urgent Open Issues
                </h3>
              </div>
              <div className="text-5xl font-extrabold text-rose-400 mb-2">
                {stats.urgent}
              </div>
              <p className="text-xs text-slate-500">
                Marked urgent and still open — needs immediate attention
              </p>
              <button
                onClick={() => {
                  setFilterStatus("Open");
                  setSearchTerm("");
                }}
                className="mt-4 text-xs text-rose-400 hover:text-rose-300 underline"
              >
                Filter open requests →
              </button>
            </div>
          ) : (
            <div className="card p-5 border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-3">
                <FiCheckCircle className="text-emerald-400 text-lg" />
                <h3 className="text-sm font-semibold text-emerald-300">All Clear</h3>
              </div>
              <p className="text-sm text-slate-400">No urgent open issues right now.</p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="card p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Campus
              </label>
              <div className="relative">
                <select
                  value={filterCampus}
                  onChange={(e) =>
                    setFilterCampus(e.target.value === "all" ? "all" : (e.target.value as Campus))
                  }
                  className="select-dark"
                >
                  <option value="all">All campuses</option>
                  {CAMPUSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={filterMainCategory}
                onChange={(e) =>
                  setFilterMainCategory(
                    e.target.value === "all" ? "all" : (e.target.value as MainCategoryId)
                  )
                }
                className="select-dark"
              >
                <option value="all">All categories</option>
                {MAIN_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value === "all" ? "all" : (e.target.value as RequestStatus)
                  )
                }
                className="select-dark"
              >
                <option value="all">All statuses</option>
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Search
              </label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Keyword, campus, location..."
                  className="input-dark pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-500">
              {filteredRequests.length === requests.length
                ? `${requests.length} total requests`
                : `${filteredRequests.length} of ${requests.length} requests`}
            </span>
            <button onClick={resetFilters} className="btn-ghost text-xs gap-1.5">
              <FiRefreshCw className="text-xs" />
              Reset filters
            </button>
          </div>
        </div>

        {/* Requests list */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <FiSearch className="text-5xl mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No requests match your filters</p>
            <button onClick={resetFilters} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((r) => {
              const mainCat = MAIN_CATEGORIES.find((m) => m.id === r.mainCategory)!;
              return (
                <div
                  key={r.id}
                  className="card p-5 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`badge ${STATUS_BADGE[r.status]}`}
                        >
                          {r.status}
                        </span>
                        {r.isPriority && (
                          <span className="badge bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <FiAlertTriangle className="text-xs" />
                            Urgent
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <div
                            className={`inline-flex w-4 h-4 items-center justify-center rounded-md ${mainCat.color}`}
                          >
                            <mainCat.icon className="text-[9px] text-white" />
                          </div>
                          {mainCat.title}
                          <span className="text-slate-700">·</span>
                          {r.subCategory}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-200 leading-relaxed line-clamp-2 mb-2">
                        {r.description}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>{r.campus}</span>
                        <span className="text-slate-700">·</span>
                        <span>{timeAgo(r.submittedAt)}</span>
                        <span className="text-slate-700">·</span>
                        <span>{r.isAnonymous ? "Anonymous" : r.name}</span>
                        {r.email && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span>{r.email}</span>
                          </>
                        )}
                        {r.location && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span>📍 {r.location}</span>
                          </>
                        )}
                        <span className="text-slate-700">·</span>
                        <span className="font-mono text-slate-600">
                          #{String(r.id).slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 flex-shrink-0">
                      <select
                        value={r.status}
                        onChange={(e) => onStatusChange(r.id, e.target.value as RequestStatus)}
                        className="bg-slate-800 border border-white/10 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        {STATUS_ORDER.map((s) => (
                          <option key={s} value={s}>Set: {s}</option>
                        ))}
                      </select>

                      <div className="flex gap-2">
                        {r.status !== "Cancelled" && (
                          <button
                            onClick={() => onCancelRequest(r.id)}
                            className="text-xs text-slate-500 hover:text-rose-400 transition-colors px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r.id)}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                            confirmDeleteId === r.id
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "text-slate-600 hover:text-rose-400"
                          }`}
                        >
                          <FiTrash2 className="text-xs" />
                          {confirmDeleteId === r.id ? "Confirm?" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
