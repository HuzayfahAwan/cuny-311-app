// src/App.tsx
import { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";
import type { AuthInfo, Campus, MainCategoryId, Request, RequestStatus, Step, Toast } from "./types";
import LandingPage from "./components/LandingPage";
import CampusSelector from "./components/CampusSelector";
import CategorySelector from "./components/CategorySelector";
import SubcategorySelector from "./components/SubcategorySelector";
import RequestForm from "./components/RequestForm";
import SuccessPage from "./components/SuccessPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const SAMPLE_REQUESTS: Request[] = [
  {
    id: 1000001,
    campus: "Hunter College",
    mainCategory: "campusFacilities",
    subCategory: "Plumbing",
    name: "Anonymous",
    isAnonymous: true,
    location: "Main Building, 3rd Floor",
    description: "Bathroom on the 3rd floor has been flooding for 2 days. Water is leaking into the hallway near room 310.",
    isPriority: true,
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "In Progress",
  },
  {
    id: 1000002,
    campus: "Baruch College",
    mainCategory: "techAccess",
    subCategory: "WiFi / Network",
    name: "Alex Rivera",
    isAnonymous: false,
    email: "alex.r@baruch.cuny.edu",
    location: "Newman Library, 2nd Floor",
    description: "WiFi drops every 10–15 minutes in the library study rooms. Makes it impossible to do research or join online classes.",
    isPriority: false,
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "Open",
  },
  {
    id: 1000003,
    campus: "City College of New York (CCNY)",
    mainCategory: "safetyConduct",
    subCategory: "Security / Public Safety",
    name: "Anonymous",
    isAnonymous: true,
    location: "North Campus Entrance",
    description: "Exterior lighting near the north entrance has been broken for over a week. Very unsafe when leaving after 8 PM.",
    isPriority: true,
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Open",
  },
  {
    id: 1000004,
    campus: "Brooklyn College",
    mainCategory: "campusLife",
    subCategory: "Dining Services",
    name: "Jordan Kim",
    isAnonymous: false,
    email: "j.kim@brooklyn.cuny.edu",
    description: "Cafeteria consistently runs out of vegetarian options by 12 PM. Many students are left without food choices.",
    isPriority: false,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Resolved",
  },
  {
    id: 1000005,
    campus: "LaGuardia Community College",
    mainCategory: "suggestions",
    subCategory: "Digital Experience / Portals / Apps",
    name: "Sam Torres",
    isAnonymous: false,
    email: "s.torres@lagcc.cuny.edu",
    description: "The student portal times out constantly and loads very slowly. A mobile app would help a lot of students.",
    isPriority: false,
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "In Progress",
  },
  {
    id: 1000006,
    campus: "Queens College",
    mainCategory: "campusFacilities",
    subCategory: "Heating / Cooling",
    name: "Maria Santos",
    isAnonymous: false,
    email: "m.santos@qc.cuny.edu",
    location: "Kiely Hall, Room 158",
    description: "No air conditioning in the classroom all semester. Temperature reached 85°F during last Tuesday's lecture.",
    isPriority: true,
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Resolved",
  },
];

const TOAST_ICONS = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
};

const TOAST_STYLES = {
  success: "bg-emerald-600 text-white",
  error: "bg-rose-600 text-white",
  info: "bg-blue-600 text-white",
};

function App() {
  const [step, setStep] = useState<Step>("landing");
  const [auth, setAuth] = useState<AuthInfo | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [selectedMain, setSelectedMain] = useState<MainCategoryId | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Verify stored session on mount ──────────────────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem("cuny311-auth");
    if (!stored) {
      setAuthChecked(true);
      return;
    }
    try {
      const parsed: AuthInfo = JSON.parse(stored);
      fetch(`${API}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${parsed.token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.valid) {
            setAuth(parsed);
          } else {
            sessionStorage.removeItem("cuny311-auth");
          }
        })
        .catch(() => sessionStorage.removeItem("cuny311-auth"))
        .finally(() => setAuthChecked(true));
    } catch {
      sessionStorage.removeItem("cuny311-auth");
      setAuthChecked(true);
    }
  }, []);

  // ── Persist requests ─────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("cuny311-requests");
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch {
        setRequests(SAMPLE_REQUESTS);
      }
    } else {
      setRequests(SAMPLE_REQUESTS);
    }
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem("cuny311-requests", JSON.stringify(requests));
    }
  }, [requests]);

  // ── Toast helpers ────────────────────────────────────────────────────────────
  const showToast = (message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const dismissToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // ── Auth handlers ────────────────────────────────────────────────────────────
  const handleLoginSuccess = (info: AuthInfo) => {
    setAuth(info);
    sessionStorage.setItem("cuny311-auth", JSON.stringify(info));
    showToast(`Welcome, ${info.displayName}!`, "success");
    setStep("history");
  };

  const handleLogout = async () => {
    if (auth) {
      try {
        await fetch(`${API}/api/admin/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${auth.token}` },
        });
      } catch { /* ignore */ }
      setAuth(null);
      sessionStorage.removeItem("cuny311-auth");
      showToast("Signed out", "info");
      setStep("landing");
    }
  };

  // ── Navigation ───────────────────────────────────────────────────────────────
  const goHome = () => {
    setStep("landing");
    setSelectedCampus(null);
    setSelectedMain(null);
    setSelectedSub(null);
  };

  const openHistory = () => {
    if (auth) {
      setStep("history");
    } else {
      setStep("adminLogin");
    }
  };

  const handleStartReport = () => setStep("selectCampus");

  const handleCampusSelect = (campus: Campus) => {
    setSelectedCampus(campus);
    setSelectedMain(null);
    setSelectedSub(null);
    setStep("selectMain");
  };

  const handleSelectMain = (id: MainCategoryId) => {
    setSelectedMain(id);
    setSelectedSub(null);
    setStep("selectSub");
  };

  const handleSelectSub = (sub: string) => {
    setSelectedSub(sub);
    setStep("fillForm");
  };

  const handleSubmitRequest = (data: Omit<Request, "id" | "submittedAt" | "status">) => {
    const newRequest: Request = {
      ...data,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      status: "Open",
    };
    setRequests((prev) => [newRequest, ...prev]);
    setLastSubmitted(newRequest);
    setStep("success");
  };

  const handleStatusChange = (id: number, status: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast(`Status updated to "${status}"`, "info");
  };

  const handleCancelRequest = (id: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id && r.status !== "Cancelled" ? { ...r, status: "Cancelled" } : r
      )
    );
    showToast("Request cancelled", "info");
  };

  const handleDeleteRequest = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast("Request deleted", "info");
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  const renderStep = () => {
    if (step === "landing") {
      return <LandingPage onStartReport={handleStartReport} onViewHistory={openHistory} />;
    }

    if (step === "adminLogin") {
      return <AdminLogin onLoginSuccess={handleLoginSuccess} onGoHome={goHome} />;
    }

    if (step === "selectCampus") {
      return (
        <CampusSelector
          onCampusSelect={handleCampusSelect}
          onGoHome={goHome}
          onViewHistory={openHistory}
        />
      );
    }

    if (step === "selectMain" && selectedCampus) {
      return (
        <CategorySelector
          campus={selectedCampus}
          onCategorySelect={handleSelectMain}
          onChangeCampus={() => setStep("selectCampus")}
          onGoHome={goHome}
          onViewHistory={openHistory}
        />
      );
    }

    if (step === "selectSub" && selectedCampus && selectedMain) {
      return (
        <SubcategorySelector
          campus={selectedCampus}
          mainCategoryId={selectedMain}
          onSubcategorySelect={handleSelectSub}
          onBackToCategories={() => setStep("selectMain")}
          onGoHome={goHome}
          onViewHistory={openHistory}
        />
      );
    }

    if (step === "fillForm" && selectedCampus && selectedMain && selectedSub) {
      return (
        <RequestForm
          campus={selectedCampus}
          mainCategoryId={selectedMain}
          subCategory={selectedSub}
          onSubmit={handleSubmitRequest}
          onBackToSubcategories={() => setStep("selectSub")}
          onGoHome={goHome}
          onViewHistory={openHistory}
        />
      );
    }

    if (step === "success" && lastSubmitted) {
      return (
        <SuccessPage
          request={lastSubmitted}
          onSubmitAnother={() => {
            setSelectedMain(null);
            setSelectedSub(null);
            setStep("selectMain");
          }}
          onViewHistory={openHistory}
          onGoHome={goHome}
        />
      );
    }

    if (step === "history" && auth) {
      return (
        <AdminDashboard
          requests={requests}
          auth={auth}
          onStatusChange={handleStatusChange}
          onCancelRequest={handleCancelRequest}
          onDeleteRequest={handleDeleteRequest}
          onBackToStart={goHome}
          onViewHistory={openHistory}
          onLogout={handleLogout}
          showToast={showToast}
        />
      );
    }

    // Fallback: if history is requested without auth, redirect to login
    if (step === "history" && !auth && authChecked) {
      setStep("adminLogin");
    }

    return null;
  };

  return (
    <>
      {renderStep()}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = TOAST_ICONS[toast.type];
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl text-sm font-medium min-w-64 max-w-sm animate-slide-in-right pointer-events-auto ${TOAST_STYLES[toast.type]}`}
            >
              <Icon className="flex-shrink-0 text-lg" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismissToast(toast.id)}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <FiX />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
