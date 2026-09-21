import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  Sparkles, 
  Share2, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const ReunionView: React.FC = () => {
  const { events, currentUser, toggleRsvp, setActiveTab } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const event = events[activeEventIndex] || events[0];
  const hasRsvpd = currentUser ? event.rsvps.includes(currentUser.id) : false;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div id="reunion-events-page" className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>মুকুল নিকেতন উচ্চ বিদ্যালয় অফিশিয়াল পুনর্মিলনী পোর্টাল</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            ঐতিহাসিক প্রাক্তন শিক্ষার্থী পুনর্মিলনী
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            স্মৃতির ক্যাম্পাস ডাকছে আবার! সকল ব্যাচের শিক্ষার্থী ও সম্মানিত শিক্ষকদের মহামিলনমেলা।
          </p>
        </div>
      </div>

      {/* Event Selector Tabs if multiple events */}
      {events.length > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {events.map((ev, index) => (
            <button
              key={ev.id}
              onClick={() => setActiveEventIndex(index)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                activeEventIndex === index
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{ev.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Event Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Banner image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-md uppercase tracking-wider">
              {event.status === 'upcoming' ? 'নির্ধারিত তারিখ' : 'পূর্ববর্তী অনুষ্ঠান'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{event.title}</h2>
          </div>
        </div>

        {/* Details & Actions */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">তারিখ</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{event.date}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">সময়</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{event.time}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">ভেন্যু বা স্থান</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{event.venue}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">অনুষ্ঠানের সংক্ষিপ্ত বিবরণ</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* RSVP & Registration Bar */}
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-blue-950 text-base">
                <Users className="w-5 h-5 text-blue-900" />
                <span>{event.rsvps.length} জন প্রাক্তনী নিবন্ধন করেছেন</span>
              </div>
              <p className="text-xs text-slate-600">
                আপনার উপস্থিতি নিশ্চিত করুন যাতে কমিটি ওয়েলকাম কিট, ব্যাচ স্যুভেনিয়ার ও আপ্যায়নের সুব্যবস্থা করতে পারে।
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentUser ? (
                <button
                  id={`rsvp-toggle-btn-${event.id}`}
                  onClick={() => toggleRsvp(event.id)}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 ${
                    hasRsvpd
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-blue-900 hover:bg-blue-800 text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{hasRsvpd ? 'উপস্থিতি নিশ্চিত (বাতিল করতে ক্লিক করুন)' : 'আমি অংশগ্রহণ করব (RSVP)'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('login')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm"
                >
                  নিবন্ধন বা RSVP করতে লগইন করুন
                </button>
              )}

              <button
                id="share-event-btn"
                onClick={handleShare}
                title="ইভেন্ট লিঙ্ক শেয়ার করুন"
                className="p-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {copied && (
            <div className="text-center text-xs font-semibold text-emerald-600">
              পুনর্মিলনী ইভেন্টের লিঙ্ক কপি করা হয়েছে!
            </div>
          )}

          {/* Schedule / Programme timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-900" />
                <span>পুনর্মিলনী দিবসের কর্মসূচি ও সময়সূচি</span>
              </h3>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 bg-white hover:bg-slate-50 transition">
                    <div className="w-28 text-xs font-extrabold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md text-center shrink-0">
                      {item.time}
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {item.activity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guidelines / FAQs */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <HelpCircle className="w-4 h-4 text-blue-900" />
              <span>অংশগ্রহণকারীদের জন্য গুরুত্বপূর্ণ নির্দেশনাবলী</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>বিদ্যালয়ের মূল ফটকে স্থাপিত রেজিস্ট্রেশন বুথ থেকে প্রবেশ পাস এবং স্মারক ব্যাজ সংগ্রহ করতে হবে।</li>
              <li>অফিসিয়াল মুকুল নিকেতন পুনর্মিলনী টি-শার্ট ও হুডি স্যুভেনিয়ার স্টোর থেকে সংগ্রহ করা যাবে।</li>
              <li>কোনো বিশেষ সহযোগিতা বা পরিবারের অতিথিদের সংক্রান্ত তথ্যের জন্য ব্যাচ ভলান্টিয়ারদের সাথে যোগাযোগ করুন।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
