import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Shield, 
  UserCheck, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  Users, 
  GraduationCap, 
  ChevronRight, 
  ChevronDown,
  Check,
  X,
  SlidersHorizontal,
  Grid, 
  FolderGit2, 
  Building2 
} from 'lucide-react';
import { StudentCardSkeleton } from './StudentCardSkeleton';

// Helper to convert numbers to Bengali digits
const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, d => bnDigits[Number(d)]);
};

// Helper to strictly extract the SSC (leaving/graduating) batch year
export const getStudentSscYear = (student: { batch?: string; sscYear?: string; schoolYears?: string }): string | null => {
  // 1. Direct sscYear if available
  if (student.sscYear) {
    const m = student.sscYear.match(/\d{4}/);
    if (m) return m[0];
  }

  // 2. Batch field (e.g. "SSC 2026", "2026", "SSC 2018")
  if (student.batch) {
    const sscMatch = student.batch.match(/ssc\s*(\d{4})/i);
    if (sscMatch) return sscMatch[1];
    const anyYear = student.batch.match(/\d{4}/);
    if (anyYear) return anyYear[0];
  }

  // 3. School years range (e.g. "2016 – 2026"): the end year is the passing/leaving (SSC) year
  if (student.schoolYears) {
    const years = student.schoolYears.match(/\d{4}/g);
    if (years && years.length > 0) {
      // Pick the last year (graduation/passing year)
      return years[years.length - 1];
    }
  }

  return null;
};

export const StudentsView: React.FC = () => {
  const { users, viewProfile, currentUser, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'branches' | 'grid'>('branches');
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Batch Picker popup/filter state (1970 - current year)
  const [isBatchPickerOpen, setIsBatchPickerOpen] = useState<boolean>(false);
  const [pickerSearchTerm, setPickerSearchTerm] = useState<string>('');
  const [selectedDecade, setSelectedDecade] = useState<string>('all');

  // Simulated fetch on mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  // Manual refresh trigger
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 550);
  };

  // Filter approved students
  const approvedStudents = useMemo(() => {
    return users.filter(u => u.role === 'student' && u.status === 'approved');
  }, [users]);

  // Dynamic calculation: 1970 to current year
  const START_YEAR = 1970;
  const currentYear = new Date().getFullYear();

  const allYears = useMemo(() => {
    const list: number[] = [];
    for (let y = currentYear; y >= START_YEAR; y--) {
      list.push(y);
    }
    return list;
  }, [currentYear]);

  // Robust student match helper for year and batch:
  // Strictly matches SSC batch year (graduation / leaving year, NOT school admission start year)
  const doesStudentMatchBatch = (student: typeof approvedStudents[0], target: string): boolean => {
    if (!target || target === 'all') return true;
    
    // Direct exact string match (e.g. "SSC 2026")
    if (student.batch === target) return true;

    // Check if target is a 4-digit year or contains a year (e.g. "2026" or "SSC 2026")
    const yearMatch = target.match(/\d{4}/);
    if (yearMatch) {
      const targetYear = yearMatch[0];
      const sscYear = getStudentSscYear(student);
      // Compare strictly with student's SSC completion/passing year
      if (sscYear === targetYear) return true;
      if (student.batch && student.batch.includes(targetYear)) return true;
      return false;
    } else {
      if (student.batch && student.batch.toLowerCase().includes(target.toLowerCase())) return true;
    }

    return false;
  };

  // Compute student count for each year (1970 - current year) based on SSC passing year
  const yearStudentCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const y of allYears) {
      counts[y] = approvedStudents.filter(s => doesStudentMatchBatch(s, String(y))).length;
    }
    return counts;
  }, [allYears, approvedStudents]);

  // Extract distinct batches existing in student profiles
  const batches = useMemo(() => {
    const list = Array.from(new Set(approvedStudents.map(s => s.batch).filter(Boolean)));
    return list.sort().reverse();
  }, [approvedStudents]);

  // Group approved students by batch year
  const batchBranches = useMemo(() => {
    const map: Record<string, typeof approvedStudents> = {};
    batches.forEach(b => {
      map[b] = approvedStudents.filter(s => s.batch === b);
    });
    return map;
  }, [approvedStudents, batches]);

  // Filtered picker years based on search term and decade
  const filteredPickerYears = useMemo(() => {
    return allYears.filter(year => {
      if (selectedDecade !== 'all') {
        const decadeStart = parseInt(selectedDecade, 10);
        if (year < decadeStart || year > decadeStart + 9) {
          return false;
        }
      }
      if (pickerSearchTerm.trim()) {
        const term = pickerSearchTerm.trim().toLowerCase();
        const yStr = String(year);
        const bnStr = toBengaliNumber(year);
        return yStr.includes(term) || bnStr.includes(term);
      }
      return true;
    });
  }, [allYears, selectedDecade, pickerSearchTerm]);

  // Select a batch/year handler
  const handleSelectBatch = (yearOrBatch: string) => {
    setSelectedBatch(yearOrBatch);
    setViewMode('grid');
    setIsBatchPickerOpen(false);
  };

  // Filtered results
  const filteredStudents = useMemo(() => {
    return approvedStudents.filter(student => {
      const matchSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.nickname && student.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.id && student.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.currentOccupation && student.currentOccupation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.location && student.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchBatch = doesStudentMatchBatch(student, selectedBatch);

      return matchSearch && matchBatch;
    });
  }, [approvedStudents, searchTerm, selectedBatch]);

  return (
    <div id="students-directory-page" className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>মুকুল নিকেতন উচ্চ বিদ্যালয় • এলুমনি ডিরেক্টরি</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              প্রাক্তন শিক্ষার্থী নেটওয়ার্ক ও এসএসসি ব্যাচ শাখা
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 leading-relaxed">
              মুকুল নিকেতনের ১৯৭০ থেকে বর্তমান পর্যন্ত সকল এসএসসি ব্যাচের তালিকা। বিদ্যালয় থেকে বের হওয়ার বছর (এসএসসি পাসের সাল) অনুযায়ী ব্যাচ ফিল্টার করে সহপাঠীদের আইডি ও প্রোফাইল খুঁজুন।
            </p>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0 self-start md:self-center">
            <button
              id="view-mode-branches-btn"
              onClick={() => { setViewMode('branches'); setSelectedBatch('all'); }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                viewMode === 'branches'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>সাল ভিত্তিক শাখা</span>
            </button>
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>সকল সদস্য গ্রিড</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="student-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম, পেশা বা সাল দিয়ে খুঁজুন (যেমন: চিত্রন ভট্টাচার্য, SSC 2026, তানভীর)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent text-sm transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                মুছুন
              </button>
            )}
          </div>

          <div className="md:col-span-4 relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              id="batch-filter-select"
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                if (e.target.value !== 'all') {
                  setViewMode('grid');
                }
              }}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm appearance-none font-medium cursor-pointer"
            >
              <option value="all">সকল এসএসসি ব্যাচ শাখা ({approvedStudents.length} জন)</option>
              <optgroup label={`১৯৭০ থেকে ${currentYear} সাল পর্যন্ত সকল এসএসসি ব্যাচ (${allYears.length} টি)`}>
                {allYears.map(year => {
                  const count = yearStudentCounts[year] || 0;
                  return (
                    <option key={year} value={String(year)}>
                      এসএসসি ব্যাচ {year} ({toBengaliNumber(year)}) {count > 0 ? `• ${count} জন সদস্য` : ''}
                    </option>
                  );
                })}
              </optgroup>
              {batches.filter(b => !allYears.some(y => String(y) === b)).length > 0 && (
                <optgroup label="অন্যান্য বিশেষ শাখা / পরিচালনা পরিষদ">
                  {batches.filter(b => !allYears.some(y => String(y) === b)).map(batch => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Quick Batch Filter Chips / Years Bar & Choose Batch Modal (Child 3) */}
        <div id="batch-filter-container" className="space-y-3 pt-1">
          {/* Main Controls Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* The primary "Choose Batch / ব্যাচ নির্বাচন করুন" Button */}
            <button
              id="btn-choose-batch"
              onClick={() => setIsBatchPickerOpen(!isBatchPickerOpen)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs ${
                isBatchPickerOpen
                  ? 'bg-amber-400 text-slate-950 border border-amber-500'
                  : selectedBatch !== 'all'
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
              title="১৯৭০ থেকে বর্তমান সাল পর্যন্ত ব্যাচ নির্বাচন করুন"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>ব্যাচ নির্বাচন করুন (Choose Batch)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-950/40 text-blue-100 font-normal">
                ১৯৭০ – {toBengaliNumber(currentYear)}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isBatchPickerOpen ? 'rotate-180 text-slate-950' : 'text-blue-200'}`} />
            </button>

            {/* "সব শাখা" Button */}
            <button
              id="btn-all-batches"
              onClick={() => { setSelectedBatch('all'); setViewMode('branches'); setIsBatchPickerOpen(false); }}
              className={`px-3 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedBatch === 'all' && viewMode === 'branches'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>সব শাখা ({approvedStudents.length})</span>
            </button>

            {/* Active Selected Batch Badge with Clear button */}
            {selectedBatch !== 'all' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>নির্বাচিত: ব্যাচ {selectedBatch} ({filteredStudents.length} জন শিক্ষার্থী)</span>
                <button
                  id="btn-clear-active-batch"
                  onClick={() => { setSelectedBatch('all'); setViewMode('branches'); }}
                  className="ml-1 p-0.5 rounded-full hover:bg-amber-200 text-amber-800 cursor-pointer transition"
                  title="ফিল্টার মুছুন"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Separator */}
            <div className="hidden sm:block h-5 w-px bg-slate-200 mx-1" />

            {/* Quick Pills for Active Batches with Registered Students */}
            <span className="text-slate-400 font-medium hidden sm:inline-flex items-center gap-1">
              <span>সক্রিয় ব্যাচ:</span>
            </span>
            {batches.slice(0, 6).map(batch => {
              const count = batchBranches[batch]?.length || 0;
              const isSelected = selectedBatch === batch;
              return (
                <button
                  key={batch}
                  onClick={() => {
                    handleSelectBatch(batch);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  <span>{batch}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-blue-950 text-amber-300' : 'bg-white text-slate-600 border border-slate-200'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Batch Picker Panel (1970 - current year) */}
          {isBatchPickerOpen && (
            <div 
              id="choose-batch-interactive-panel" 
              className="bg-white rounded-2xl border-2 border-blue-900/30 shadow-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              {/* Picker Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span>এসএসসি ব্যাচ নির্বাচন করুন (Choose SSC Batch)</span>
                      <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                        ১৯৭০ – {toBengaliNumber(currentYear)} ({allYears.length} টি ব্যাচ)
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      বিদ্যালয় থেকে বের হওয়ার সাল (এসএসসি পাসের বছর)-কে ব্যাচ হিসেবে বিবেচনা করে ফিল্টার করা হয়।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => { setSelectedBatch('all'); setViewMode('branches'); setIsBatchPickerOpen(false); }}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100 rounded-lg transition"
                  >
                    সকল ব্যাচ দেখাও
                  </button>
                  <button
                    onClick={() => setIsBatchPickerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title="প্যানেল বন্ধ করুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Picker Filter Controls: Search & Decades */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Year */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="picker-year-search"
                    type="text"
                    value={pickerSearchTerm}
                    onChange={(e) => setPickerSearchTerm(e.target.value)}
                    placeholder="সাল দিয়ে খুঁজুন (যেমন: 2026, 1995, 1980)..."
                    className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900 transition"
                  />
                  {pickerSearchTerm && (
                    <button
                      onClick={() => setPickerSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Decade Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-[11px]">
                  <button
                    onClick={() => setSelectedDecade('all')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedDecade === 'all'
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    সকল সাল
                  </button>
                  {[
                    { id: '2020', label: '২০২০-এর দশক' },
                    { id: '2010', label: '২০১০-এর দশক' },
                    { id: '2000', label: '২০০০-এর দশক' },
                    { id: '1990', label: '১৯৯০-এর দশক' },
                    { id: '1980', label: '১৯৮০-এর দশক' },
                    { id: '1970', label: '১৯৭০-এর দশক' }
                  ].map(decade => (
                    <button
                      key={decade.id}
                      onClick={() => setSelectedDecade(decade.id)}
                      className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                        selectedDecade === decade.id
                          ? 'bg-blue-900 text-white shadow-xs font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {decade.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Years (1970 to Current Year) */}
              <div className="max-h-64 overflow-y-auto p-1 pr-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 border border-slate-100 rounded-xl bg-slate-50/50">
                {filteredPickerYears.map(year => {
                  const yStr = String(year);
                  const isSelected = selectedBatch === yStr || selectedBatch.includes(yStr);
                  const count = yearStudentCounts[year] || 0;
                  const hasMembers = count > 0;

                  return (
                    <button
                      key={year}
                      id={`picker-year-btn-${year}`}
                      onClick={() => handleSelectBatch(yStr)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-blue-900 text-white border-blue-900 shadow-sm ring-2 ring-blue-900/30'
                          : hasMembers
                          ? 'bg-white hover:bg-blue-50/80 border-blue-300 shadow-2xs hover:border-blue-500'
                          : 'bg-white hover:bg-slate-100 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black font-mono tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {year}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span className={`text-[10px] ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                          ব্যাচ {toBengaliNumber(year)}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                          isSelected
                            ? 'bg-blue-950 text-amber-300'
                            : hasMembers
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {count > 0 ? `${count} জন` : '০ জন'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredPickerYears.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs">
                  কোনো ব্যাচ সাল খুঁজে পাওয়া যায়নি।
                </div>
              )}

              {/* Bottom Information & Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300 inline-block"></span>
                    <span>নিবন্ধিত প্রাক্তনী আছে</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200 inline-block"></span>
                    <span>এখনও কোনো সদস্য নেই</span>
                  </span>
                </div>
                <div>
                  মুকুল নিকেতন উচ্চ বিদ্যালয় • EIIN: 111847 • প্রতিষ্ঠাতা অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন (১৯৭০)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Account Notice if logged in user is pending */}
      {currentUser && currentUser.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900">
            <strong>আপনার প্রোফাইলটি অনুমোদনের অপেক্ষায় রয়েছে:</strong> আপনি <span className="font-semibold">{currentUser.name}</span> হিসেবে লগইন করেছেন। অ্যাডমিনের অনুমোদনের সাথে সাথে আপনার প্রোফাইলটি ডিরেক্টরিতে প্রকাশ্যে দৃশ্যমান হবে।
          </div>
        </div>
      )}

      {/* Results Header Count & Refresh Control */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-600 px-1">
        {isLoading ? (
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-44 bg-slate-200 rounded-md animate-pulse" />
            <div className="flex items-center gap-1.5 text-blue-900 font-medium text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>ডিরেক্টরি তথ্য লোড হচ্ছে...</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div>
              {viewMode === 'branches' ? (
                <span>
                  মোট <strong className="text-slate-900">{batches.length}</strong> টি সাল ভিত্তিক ব্যাচ শাখা (<strong className="text-slate-900">{approvedStudents.length}</strong> জন নিবন্ধিত প্রাক্তনী)
                </span>
              ) : (
                <span>
                  প্রদর্শিত হচ্ছে <strong className="text-slate-900">{filteredStudents.length}</strong> জন প্রাক্তনী
                  {searchTerm && <span> অনুসন্ধান: "<span className="text-blue-900 font-semibold">{searchTerm}</span>"</span>}
                  {selectedBatch !== 'all' && <span> ব্যাচ: <span className="text-blue-900 font-semibold">{selectedBatch}</span></span>}
                </span>
              )}
            </div>
            <button
              onClick={handleRefresh}
              title="ডিরেক্টরি রিফ্রেশ করুন"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-900 transition font-medium p-1 hover:bg-slate-100 rounded-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
          </div>
        )}
      </div>

      {/* Directory Content: Year-wise Branches vs All Grid vs Empty State */}
      {isLoading ? (
        <div id="students-directory-skeletons" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <StudentCardSkeleton key={index} id={`student-card-skeleton-${index}`} />
          ))}
        </div>
      ) : viewMode === 'branches' && selectedBatch === 'all' && !searchTerm ? (
        /* YEAR-WISE ALUMNI BRANCHES VIEW */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map(batchYear => {
              const members = batchBranches[batchYear] || [];
              const isExpanded = expandedBranch === batchYear;

              return (
                <div 
                  key={batchYear}
                  id={`batch-branch-card-${batchYear.replace(/\s+/g, '-').toLowerCase()}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    {/* Branch Card Top Badge & Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs">
                          <Calendar className="w-3.5 h-3.5 text-blue-800" />
                          <span>{batchYear} শাখা</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 pt-1">
                          {batchYear} ব্যাচ
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">{members.length}</span>
                        <div className="text-[10px] text-slate-500 font-medium">নিবন্ধিত সদস্য</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      মুকুল নিকেতন উচ্চ বিদ্যালয়ের {batchYear} ব্যাচের নিবন্ধিত প্রাক্তন শিক্ষার্থীদের তালিকা ও তথ্যাবলী।
                    </p>

                    {/* Member Avatars Stack Preview */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center -space-x-2">
                        {members.slice(0, 4).map((m, i) => (
                          <img
                            key={m.id}
                            src={m.profilePhoto}
                            alt={m.name}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                            title={`${m.name} (${m.batch})`}
                          />
                        ))}
                        {members.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 text-amber-300 font-bold text-[10px] flex items-center justify-center shadow-2xs">
                            +{members.length - 4}
                          </div>
                        )}
                      </div>

                      <span className="text-xs font-semibold text-slate-500">
                        {members.length > 0 ? `${members[0].name.split(' ')[0]} ও অন্যান্য` : 'কোনো সদস্য নেই'}
                      </span>
                    </div>
                  </div>

                  {/* Branch Card Action Footer */}
                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedBatch(batchYear);
                        setViewMode('grid');
                      }}
                      className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>শাখার সকল সদস্য দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setExpandedBranch(isExpanded ? null : batchYear)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium underline cursor-pointer"
                    >
                      {isExpanded ? 'সংক্ষেপ করুন' : 'তালিকাতালিকা বিস্তারিত'}
                    </button>
                  </div>

                  {/* Accordion Expanded Preview in Branch */}
                  {isExpanded && (
                    <div className="p-4 bg-blue-50/50 border-t border-blue-100 space-y-3">
                      <div className="text-xs font-bold text-slate-900 border-b border-blue-200/60 pb-1.5">
                        {batchYear} ব্যাচের প্রাক্তনীগণ:
                      </div>
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {members.map(member => (
                          <div 
                            key={member.id}
                            onClick={() => viewProfile(member.id)}
                            className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 flex items-center justify-between gap-3 cursor-pointer transition shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={member.profilePhoto} alt={member.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">{member.name}</div>
                                <div className="text-[11px] text-slate-500 truncate">{member.currentOccupation || member.classSection}</div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : filteredStudents.length > 0 ? (
        /* GRID VIEW FOR FILTERED STUDENTS */
        <div className="space-y-4">
          {selectedBatch !== 'all' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                    <span>এসএসসি সাল ভিত্তিক ফিল্টার সক্রিয়</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>এসএসসি ব্যাচ: {selectedBatch}</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    এসএসসি {selectedBatch} ({toBengaliNumber(selectedBatch)}) ব্যাচ • মোট {filteredStudents.length} জন শিক্ষার্থীর আইডি তালিকা ও প্রোফাইল
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBatchPickerOpen(true)}
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <span>অন্য সাল/ব্যাচ নির্বাচন</span>
                </button>
                <button
                  onClick={() => { setSelectedBatch('all'); setViewMode('branches'); }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" />
                  <span>সকল ব্যাচ দেখুন</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map(student => (
              <div
                key={student.id}
                id={`student-profile-card-${student.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between group"
              >
                {/* Card Header & Avatar */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative">
                      <img
                        src={student.profilePhoto}
                        alt={student.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-xs group-hover:scale-105 transition"
                      />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                        {student.batch?.toLowerCase().startsWith('ssc') ? student.batch : `এসএসসি ${student.batch}`}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold" title="শিক্ষার্থী আইডি">
                        আইডি: #{student.id}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition flex items-center gap-1.5">
                      <span>{student.name}</span>
                      {student.nickname && (
                        <span className="text-xs font-normal text-slate-500">({student.nickname})</span>
                      )}
                    </h3>

                    <div className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{student.classSection || 'মুকুল নিকেতন উচ্চ বিদ্যালয়'}</span>
                      {student.rollNumber && (
                        <span className="text-[11px] font-mono text-slate-400">রোল: {student.rollNumber}</span>
                      )}
                    </div>

                    {student.shortBio && (
                      <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                        "{student.shortBio}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Location & Profile Button */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {student.location?.split(',')[0] || 'ময়মনসিংহ'}
                  </span>

                  <button
                    id={`view-profile-btn-${student.id}`}
                    onClick={() => viewProfile(student.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 py-1 px-2.5 rounded-md hover:bg-blue-50 transition cursor-pointer"
                  >
                    <span>প্রোফাইল ও আইডি</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7 text-blue-800" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {selectedBatch !== 'all' 
              ? `ব্যাচ ${selectedBatch} (${toBengaliNumber(selectedBatch)})-এ কোনো অ্যাকাউন্ট নেই` 
              : 'কোনো শিক্ষার্থী পাওয়া যায়নি'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {selectedBatch !== 'all' 
              ? `মুকুল নিকেতন উচ্চ বিদ্যালয়ের ${selectedBatch} ব্যাচের কোনো শিক্ষার্থী এখনও প্ল্যাটফর্মে নিবন্ধিত হননি। ১৯৭০ থেকে বর্তমান সকল ব্যাচের প্রাক্তনীরা রেজিস্ট্রেশন করতে পারবেন।`
              : `"${searchTerm}" এর সাথে মিলে এমন কোনো অনুমোদিত শিক্ষার্থী পাওয়া যায়নি। অনুগ্রহ করে অন্য সাল/ব্যাচ ফিল্টার চয়ন করুন।`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsBatchPickerOpen(true)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>অন্য ব্যাচ নির্বাচন করুন</span>
            </button>
            <button
              onClick={() => { setSearchTerm(''); setSelectedBatch('all'); setViewMode('branches'); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              সকল ব্যাচ দেখুন
            </button>
          </div>
        </div>
      )}

      {/* Bottom CTA for students */}
      <div className="bg-slate-900 text-white rounded-none border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <h3 className="text-xl font-bold">আপনি কি মুকুল নিকেতন উচ্চ বিদ্যালয়ের প্রাক্তন শিক্ষার্থী?</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {currentUser 
              ? 'কমিউনিটির সাথে যুক্ত থাকুন এবং আলাপ পাতায় সহপাঠীদের সাথে গল্পগুজব করুন।' 
              : 'আজই আপনার অ্যালামনাই প্রোফাইল তৈরি করুন এবং আপনার ব্যাচ শাখায় যুক্ত থাকুন।'}
          </p>
        </div>
        {currentUser ? (
          <button
            id="cta-goto-community-btn"
            onClick={() => setActiveTab('community')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-none transition shadow-xs whitespace-nowrap cursor-pointer"
          >
            আলাপ পাতায় যান
          </button>
        ) : (
          <button
            id="cta-join-directory-btn"
            onClick={() => setActiveTab('register')}
            className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-none transition shadow-xs whitespace-nowrap cursor-pointer"
          >
            প্রাক্তন শিক্ষার্থী নিবন্ধন
          </button>
        )}
      </div>
    </div>
  );
};
