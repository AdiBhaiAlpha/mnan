import React from 'react';
import { School, MapPin, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SchoolTopBar: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div id="school-official-topbar" className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: School Identification */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <School className="w-3.5 h-3.5 text-amber-400" />
            <span>মুকুল নিকেতন উচ্চ বিদ্যালয়, ময়মনসিংহ</span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400">
            EIIN: <strong className="text-slate-200">১১১৮৪৭</strong>
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">
            স্থাপিত: <strong className="text-slate-200">১৯৭০</strong>
          </span>
          <span className="hidden lg:inline text-slate-600">•</span>
          <div className="hidden lg:flex items-center gap-1 text-slate-400">
            <MapPin className="w-3 h-3 text-red-400" />
            <span>১০, মহারাজা রোড, ময়মনসিংহ-২২০০</span>
          </div>
        </div>

        {/* Right: Quick Official Links & Session indicator */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <User className="w-3 h-3 text-blue-400" />
              <span>{currentUser.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
