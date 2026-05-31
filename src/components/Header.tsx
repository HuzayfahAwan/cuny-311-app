// src/components/Header.tsx
import { FiGrid } from "react-icons/fi";

interface HeaderProps {
  onGoHome: () => void;
  onViewHistory: () => void;
}

export default function Header({ onGoHome, onViewHistory }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 group"
        >
          <img
            src="/University_Name_Correct_Logo_Usage3.png"
            alt="CUNY"
            className="h-9 w-auto"
          />
          <div className="text-left">
            <div className="text-base font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">
              CUNY 311
            </div>
            <div className="text-[10px] text-slate-500 leading-tight tracking-wider uppercase">
              Campus Portal
            </div>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            className="btn-ghost text-sm hidden sm:flex"
          >
            Home
          </button>
          <button
            onClick={onViewHistory}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-sm font-medium rounded-lg px-4 py-2 transition-all duration-200 active:scale-95"
          >
            <FiGrid className="text-blue-400" />
            Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
}
