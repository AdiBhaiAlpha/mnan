import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, ArrowRight, Shield, UserCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { StudentCardSkeleton } from './StudentCardSkeleton';

export const StudentsView: React.FC = () => {
  const { users, viewProfile, currentUser, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulated fetch on mount to showcase loading skeleton state
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

  // Filter approved students (and if admin, option to view all or see status)
  const approvedStudents = useMemo(() => {
    return users.filter(u => u.role === 'student' && u.status === 'approved');
  }, [users]);

  // Extract distinct batches
  const batches = useMemo(() => {
    const list = Array.from(new Set(approvedStudents.map(s => s.batch).filter(Boolean)));
    return list.sort().reverse();
  }, [approvedStudents]);

  // Filtered results
  const filteredStudents = useMemo(() => {
    return approvedStudents.filter(student => {
      const matchSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.nickname && student.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.currentOccupation && student.currentOccupation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.location && student.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchBatch = selectedBatch === 'all' || student.batch === selectedBatch;

      return matchSearch && matchBatch;
    });
  }, [approvedStudents, searchTerm, selectedBatch]);

  return (
    <div id="students-directory-page" className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            মুকুল নিকেতন প্রাক্তন শিক্ষার্থী ডিরেক্টরি
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            মুকুল নিকেতনের ভেরিফাইড শিক্ষার্থীদের ডিরেক্টরি। আপনার ব্যাচমেট, সহপাঠী ও পুরোনো বন্ধুদের সহজে খুঁজে নিন।
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="student-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম, পেশা বা ব্যাচ দিয়ে খুঁজুন (যেমন: চিত্রন ভট্টাচার্য, SSC 2026, তানভীর)..."
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
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm appearance-none font-medium cursor-pointer"
            >
              <option value="all">সকল ব্যাচ ({approvedStudents.length})</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>
                  ব্যাচ: {batch}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Batch Filter Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">দ্রুত ফিল্টার:</span>
          <button
            onClick={() => setSelectedBatch('all')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              selectedBatch === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সকল
          </button>
          {batches.map(batch => (
            <button
              key={batch}
              onClick={() => setSelectedBatch(batch)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                selectedBatch === batch
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {batch}
            </button>
          ))}
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

      {/* Results Count & Refresh Control */}
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
              প্রদর্শিত হচ্ছে <strong className="text-slate-900">{filteredStudents.length}</strong> জন প্রাক্তনী
              {searchTerm && <span> অনুসন্ধান: "<span className="text-blue-900 font-semibold">{searchTerm}</span>"</span>}
              {selectedBatch !== 'all' && <span> ব্যাচ: <span className="text-blue-900 font-semibold">{selectedBatch}</span></span>}
            </div>
            <button
              onClick={handleRefresh}
              title="ডিরেক্টরি রিফ্রেশ করুন"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-900 transition font-medium p-1 hover:bg-slate-100 rounded-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
          </div>
        )}
      </div>

      {/* Directory Content: Skeletons vs Data vs Empty State */}
      {isLoading ? (
        <div id="students-directory-skeletons" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <StudentCardSkeleton key={index} id={`student-card-skeleton-${index}`} />
          ))}
        </div>
      ) : filteredStudents.length > 0 ? (
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

                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                    ব্যাচ: {student.batch}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition flex items-center gap-1.5">
                    <span>{student.name}</span>
                    {student.nickname && (
                      <span className="text-xs font-normal text-slate-500">({student.nickname})</span>
                    )}
                  </h3>

                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    {student.classSection || 'মুকুল নিকেতন উচ্চ বিদ্যালয়'}
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 py-1 px-2.5 rounded-md hover:bg-blue-50 transition"
                >
                  <span>প্রোফাইল দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <Search className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">কোনো শিক্ষার্থী পাওয়া যায়নি</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            "{searchTerm}" এর সাথে মিলে এমন কোনো অনুমোদিত শিক্ষার্থী পাওয়া যায়নি। অনুগ্রহ করে বানান যাচাই করুন বা অন্য ব্যাচ নির্বাচন করুন।
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedBatch('all'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}

      {/* Bottom CTA for students */}
      <div className="bg-slate-900 text-white rounded-none border border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div>
          <h3 className="text-xl font-bold">আপনি কি মুকুল নিকেতন উচ্চ বিদ্যালয়ের প্রাক্তন শিক্ষার্থী?</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {currentUser 
              ? 'কমিউনিটির সাথে যুক্ত থাকুন এবং আলাপ পাতায় সহপাঠীদের সাথে গল্পগুজব করুন।' 
              : 'আজই আপনার অ্যালামনাই প্রোফাইল তৈরি করুন এবং হাজারো সহপাঠীর সাথে যুক্ত থাকুন।'}
          </p>
        </div>
        {currentUser ? (
          <button
            id="cta-goto-community-btn"
            onClick={() => setActiveTab('community')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-none transition shadow-xs whitespace-nowrap"
          >
            আলাপ পাতায় যান
          </button>
        ) : (
          <button
            id="cta-join-directory-btn"
            onClick={() => setActiveTab('register')}
            className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-none transition shadow-xs whitespace-nowrap"
          >
            প্রাক্তন শিক্ষার্থী নিবন্ধন
          </button>
        )}
      </div>
    </div>
  );
};
