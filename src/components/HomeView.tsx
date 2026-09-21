import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isAdminName } from '../types';
import { 
  Users, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Clock, 
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  School,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Ticket,
  CheckCircle2,
  Lock,
  PlusCircle,
  Trash2,
  MessageSquare
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { users, events, setActiveTab, viewProfile, currentUser, toggleRsvp, deleteEvent } = useApp();
  const isAdmin = currentUser?.role === 'admin' || (currentUser ? isAdminName(currentUser.name) : false);

  // Statistics
  const approvedStudents = users.filter(u => u.status === 'approved' && u.role === 'student');
  const totalRegistered = users.filter(u => u.role === 'student').length;
  
  // Extract unique batches
  const uniqueBatches = Array.from(
    new Set(approvedStudents.map(u => u.batch).filter(Boolean))
  );

  // Recent students
  const recentStudents = [...approvedStudents].slice(0, 4);

  // Upcoming events list
  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const activeEventsList = upcomingEvents.length > 0 ? upcomingEvents : events;
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  const currentEvent = activeEventsList.find(e => e.id === selectedEventId) || activeEventsList[0];
  const isBooked = currentUser && currentEvent ? currentEvent.rsvps.includes(currentUser.id) : false;

  return (
    <div id="home-view-container" className="space-y-10 pb-16">
      {/* Hero Banner Section with Academic Dignity */}
      <section className="relative overflow-hidden rounded-none bg-slate-900 text-white shadow-md border border-slate-800">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:py-16 max-w-5xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              মুকুল নিকেতন প্রাক্তন শিক্ষার্থী নেটওয়ার্ক
            </h1>
            <div className="text-lg sm:text-2xl font-bold text-amber-300 font-sans tracking-wide">
              Mukul Niketan Alumni Network
            </div>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-block bg-slate-800/80 border border-amber-400/30 px-4 py-2 text-amber-200 font-bold text-sm sm:text-base">
              একই শিকড়, একসাথে পথচলা — <span className="text-amber-300 font-sans font-semibold">Connecting Generations of Mukul Niketan</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              ১৯৭০ সালে অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন এর হাতে প্রতিষ্ঠিত ময়মনসিংহের ঐতিহ্যবাহী বিদ্যাপীঠ। অর্ধশতাব্দীর স্মৃতি, শিক্ষক-শিক্ষার্থীদের গভীর বন্ধন এবং আগামীর দিনগুলোকে সংযুক্ত রাখতে এই প্রাতিষ্ঠানিক প্ল্যাটফর্ম।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="hero-about-school-btn"
              onClick={() => setActiveTab('about')}
              className="w-full sm:w-auto px-6 py-3 rounded-none font-bold bg-white hover:bg-slate-100 text-slate-900 shadow-xs transition-all flex items-center justify-center gap-2 text-xs"
            >
              <BookOpen className="w-4 h-4 text-slate-700" />
              <span>বিদ্যালয় পরিচিতি ও ইতিহাস</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {currentUser ? (
              <button
                id="hero-join-community-btn"
                onClick={() => setActiveTab('community')}
                className="w-full sm:w-auto px-6 py-3 rounded-none font-bold bg-blue-700 hover:bg-blue-600 text-white shadow-xs transition-all flex items-center justify-center gap-2 text-xs"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>আলাপ পাতায় যান</span>
              </button>
            ) : (
              <button
                id="hero-join-community-btn"
                onClick={() => setActiveTab('register')}
                className="w-full sm:w-auto px-6 py-3 rounded-none font-bold bg-blue-700 hover:bg-blue-600 text-white shadow-xs transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span>প্রাক্তন শিক্ষার্থী নিবন্ধন</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Academic Counters Strip */}
        <div className="border-t border-slate-800 bg-slate-950/60 py-4 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-slate-800/80">
            <div className="px-2">
              <div className="text-xl sm:text-2xl font-black text-amber-400">১৯৭০</div>
              <div className="text-[11px] text-slate-400 font-medium">প্রতিষ্ঠা সন</div>
            </div>
            <div className="px-2">
              <div className="text-xl sm:text-2xl font-black text-white">৪,০০০+</div>
              <div className="text-[11px] text-slate-400 font-medium">বর্তমান শিক্ষার্থী</div>
            </div>
            <div className="px-2">
              <div className="text-xl sm:text-2xl font-black text-white">{totalRegistered}</div>
              <div className="text-[11px] text-slate-400 font-medium">নিবন্ধিত প্রাক্তনী</div>
            </div>
            <div className="px-2">
              <div className="text-xl sm:text-2xl font-black text-blue-400">৫৫+ বছর</div>
              <div className="text-[11px] text-slate-400 font-medium">শিক্ষার আলো</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Card: About Mukul Niketon High School Brief */}
      <section className="bg-white rounded-none border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <School className="w-4 h-4 text-blue-800" />
              <span>ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান • গৌরবময় পথচলা</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              মুকুল নিকেতন উচ্চ বিদ্যালয় পরিচিতি
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              ময়মনসিংহ শহরের কেন্দ্রস্থলে ১০, মহারাজা রোডে শ্রী শ্রী কানাই মন্দিরের পাশে ও ময়মনসিংহ রেলওয়ে স্টেশনের কাছে প্রায় ১ একর জমির উপর অবস্থিত। ১৯৭০ সালে অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন এর হাত ধরে যাত্রা শুরু করে এটি আজ বৃহত্তর ময়মনসিংহের অন্যতম শীর্ষ শিক্ষাঙ্গন। ছাত্র ও ছাত্রীদের জন্য পৃথক আধুনিক ভবন, আবাসিক হোস্টেল, সমৃদ্ধ পাঠাগার এবং সক্রিয় বিতর্ক ও স্কাউট দল নিয়ে প্রতিষ্ঠানটি সুপরিচিত।
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-none bg-slate-100 text-slate-700 font-medium border border-slate-200">
                ইআইআইএন: ১১১৮৪৭
              </span>
              <span className="px-2.5 py-1 rounded-none bg-slate-100 text-slate-700 font-medium border border-slate-200">
                প্রধান শিক্ষক: মোঃ সামছুল আলম
              </span>
              <span className="px-2.5 py-1 rounded-none bg-slate-100 text-slate-700 font-medium border border-slate-200">
                শ্রেণি: নার্সারি - দশম
              </span>
              <span className="px-2.5 py-1 rounded-none bg-slate-100 text-slate-700 font-medium border border-slate-200">
                অবস্থান: ১০, মহারাজা রোড, ময়মনসিংহ
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-none border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-800" />
              <span>সম্পূর্ণ তথ্য ও ইতিহাস</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              বিদ্যালয়ের প্রতিষ্ঠাতা অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন এর অবদান, বাঁশের টালাই থেকে আধুনিক রূপান্তর ও সহ-শিক্ষার অর্জন সম্পর্কে জানুন।
            </p>
            <button
              id="home-goto-about-btn"
              onClick={() => setActiveTab('about')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-none transition flex items-center justify-center gap-1.5"
            >
              <span>বিস্তারিত পরিচিতি পেজ দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Spotlight: Upcoming Reunion Event */}
      {currentEvent && (
        <section id="upcoming-reunion-spotlight" className="bg-white rounded-none border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-none bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider border border-blue-200">
                  <Calendar className="w-3.5 h-3.5 text-blue-800" />
                  <span>আসন্ন অনুষ্ঠান ও সমাবেশ</span>
                </div>
                {currentEvent.createdByName && (
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-none border border-slate-200">
                    আয়োজক: {currentEvent.createdByName} {currentEvent.createdByBatch ? `(${currentEvent.createdByBatch})` : ''}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentEvent.title}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {currentEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-blue-800" />
                  <span>{currentEvent.date} • {currentEvent.time}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>{currentEvent.venue}</span>
                </div>
              </div>
            </div>

            {/* Event Booking & Action Section */}
            <div className="w-full lg:w-auto flex flex-col gap-2.5 min-w-[240px]">
              {currentUser ? (
                isBooked ? (
                  <div className="space-y-1.5 w-full">
                    <div className="w-full px-4 py-3 rounded-none bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>আপনার আসন নিশ্চিত ({currentEvent.rsvps.length} জন বুকড)</span>
                    </div>
                    <button
                      id="spotlight-cancel-booking-btn"
                      onClick={() => toggleRsvp(currentEvent.id)}
                      className="w-full text-center text-[11px] text-slate-500 hover:text-red-600 transition underline"
                    >
                      বুকিং পরিবর্তন বা বাতিল করুন
                    </button>
                  </div>
                ) : (
                  <button
                    id="spotlight-book-event-btn"
                    onClick={() => toggleRsvp(currentEvent.id)}
                    className="w-full px-5 py-3 rounded-none bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs text-center shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-amber-300" />
                    <span>
                      {currentEvent.rsvps.length > 0 
                        ? `অনুষ্ঠান বুক করুন (${currentEvent.rsvps.length} জন নিবন্ধিত)` 
                        : 'অনুষ্ঠান বুক করুন'}
                    </span>
                  </button>
                )
              ) : (
                <div className="space-y-2 w-full">
                  <button
                    id="spotlight-signup-to-book-btn"
                    onClick={() => setActiveTab('register')}
                    className="w-full px-5 py-3 rounded-none bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs text-center shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>সাইন আপ করে অনুষ্ঠান বুক করুন</span>
                  </button>
                  <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                    <span>অ্যাকাউন্ট আছে?</span>
                    <button
                      id="spotlight-login-btn"
                      onClick={() => setActiveTab('login')}
                      className="text-blue-900 font-bold underline hover:text-blue-700"
                    >
                      লগইন করুন
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 pt-1">
                {isAdmin && (
                  <button
                    id="spotlight-admin-delete-event-btn"
                    onClick={() => {
                      if (window.confirm(`এডমিন হিসেবে "${currentEvent.title}" অনুষ্ঠানটি কি সম্পূর্ণ মুছে ফেলতে চান?`)) {
                        deleteEvent(currentEvent.id);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-none bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs text-center transition flex items-center justify-center gap-1.5 border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>এডমিন: অনুষ্ঠান ডিলিট করুন</span>
                  </button>
                )}

                <button
                  id="spotlight-goto-community-btn"
                  onClick={() => setActiveTab('community')}
                  className="w-full px-4 py-2.5 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-blue-900" />
                  <span>আলাপ পাতায় নতুন অনুষ্ঠান ঘোষণা</span>
                </button>
              </div>
            </div>
          </div>

          {/* If multiple events exist (including ones posted from "আলাপ"), display all of them here */}
          {activeEventsList.length > 1 && (
            <div className="pt-6 border-t border-slate-200 mt-6">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-800">
                  সকল আসন্ন অনুষ্ঠানের তালিকা ({activeEventsList.length} টি):
                </span>
                <span className="text-[11px] text-slate-500">
                  যেকোনো একটি নির্বাচন করে বিবরণ ও বুকিং স্ট্যাটাস দেখুন
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeEventsList.map(evt => {
                  const isSelected = evt.id === currentEvent.id;
                  const userBooked = currentUser && evt.rsvps.includes(currentUser.id);

                  return (
                    <div
                      key={evt.id}
                      className={`text-left p-3.5 rounded-none border transition flex flex-col justify-between gap-2 relative ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-900 ring-1 ring-blue-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-white border-slate-200'
                      }`}
                    >
                      <div 
                        id={`event-selector-${evt.id}`}
                        onClick={() => setSelectedEventId(evt.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-extrabold text-xs text-slate-900 line-clamp-1">
                            {evt.title}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {userBooked && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-none">
                                বুকড ✓
                              </span>
                            )}
                            {isAdmin && (
                              <button
                                id={`admin-delete-grid-event-${evt.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`এডমিন হিসেবে "${evt.title}" অনুষ্ঠানটি মুছে ফেলতে চান?`)) {
                                    deleteEvent(evt.id);
                                  }
                                }}
                                title="এডমিন: অনুষ্ঠান ডিলিট করুন"
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-none transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{evt.description}</p>
                      </div>

                      <div 
                        onClick={() => setSelectedEventId(evt.id)}
                        className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 cursor-pointer"
                      >
                        <span className="font-medium">{evt.date}</span>
                        <span className="text-blue-900 font-semibold">{evt.rsvps.length} জন বুকড</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Verified Registered Students Section */}
      {recentStudents.length > 0 && (
        <section id="recent-students-section" className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-900" />
                <span className="font-extrabold text-slate-900">প্রাক্তন শিক্ষার্থী ডিরেক্টরি</span>
              </h2>
            </div>
            <button
              id="see-all-directory-btn"
              onClick={() => setActiveTab('students')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 transition"
            >
              <span>সকল শিক্ষার্থী ডিরেক্টরি দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentStudents.map(student => (
              <div
                key={student.id}
                id={`student-card-${student.id}`}
                onClick={() => viewProfile(student.id)}
                className="bg-white rounded-none border border-slate-200 p-4 shadow-xs hover:shadow-sm hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={student.profilePhoto}
                      alt={student.name}
                      className="w-12 h-12 rounded-none object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-950 transition leading-snug">
                        {student.name}
                      </h3>
                      <div className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-none bg-slate-100 text-slate-700 border border-slate-200 mt-1">
                        ব্যাচ: {student.batch}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 mb-1.5 font-medium">
                    {student.classSection || 'মুকুল নিকেতন উচ্চ বিদ্যালয়'}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {student.currentOccupation || student.shortBio}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {student.location?.split(',')[0] || 'ময়মনসিংহ'}
                  </span>
                  <span className="font-bold text-blue-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-xs">
                    <span>প্রোফাইল দেখুন</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
