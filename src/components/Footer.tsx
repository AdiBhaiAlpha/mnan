import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Shield, BookOpen } from 'lucide-react';
import { ActiveTab } from '../types';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-700 p-1 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/bn/thumb/f/fb/%E0%A6%AE%E0%A7%81%E0%A6%95%E0%A7%81%E0%A6%B2_%E0%A6%A8%E0%A6%BF%E0%A6%95%E0%A7%87%E0%A6%A4%E0%A6%A8_%E0%A6%89%E0%A6%9A%E0%A7%8D%E0%A6%9A_%E0%A6%AC%E0%A6%BF%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A6%AF%E0%A6%BC%2C_%E0%A6%AE%E0%A6%AF%E0%A6%BC%E0%A6%AE%E0%A6%A8%E0%A6%B8%E0%A6%BF%E0%A6%82%E0%A6%B9_%E0%A6%8F%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png/250px-%E0%A6%AE%E0%A7%81%E0%A6%95%E0%A7%81%E0%A6%B2_%E0%A6%A8%E0%A6%BF%E0%A6%95%E0%A7%87%E0%A6%A4%E0%A6%A8_%E0%A6%89%E0%A6%9A%E0%A7%8D%E0%A6%9A_%E0%A6%AC%E0%A6%BF%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A6%AF%E0%A6%BC%2C_%E0%A6%AE%E0%A6%AF%E0%A6%BC%E0%A6%AE%E0%A6%A8%E0%A6%B8%E0%A6%BF%E0%A6%82%E0%A6%B9_%E0%A6%8F%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png"
                  alt="মুকুল নিকেতন উচ্চ বিদ্যালয় লোগো"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-extrabold text-base text-white tracking-tight">
                  মুকুল নিকেতন উচ্চ বিদ্যালয়, ময়মনসিংহ
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Mukul Niketon High School • EIIN: ১১১৮৪৭ • স্থাপিত: ১৯৭০
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              ১৯৭০ সালে অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন এর হাতে প্রতিষ্ঠিত ময়মনসিংহের অন্যতম শীর্ষ বেসরকারি বিদ্যাপীঠ। এই প্ল্যাটফর্মটি বিদ্যালয়ের প্রাক্তন শিক্ষার্থীদের পারস্পরিক যোগাযোগ ও স্মৃতি সংরক্ষণে নিবেদিত।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              প্রয়োজনীয় লিংক
            </div>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-amber-300 transition text-left">
                  মূলপাতা
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-amber-300 transition text-left font-semibold text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  <span>বিদ্যালয় পরিচিতি ও ইতিহাস</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('students')} className="hover:text-amber-300 transition text-left">
                  প্রাক্তন শিক্ষার্থী তালিকা
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('community')} className="hover:text-amber-300 transition text-left">
                  আলাপ
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Member Rules */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>নিরাপত্তা ও নীতিমালা</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              শিক্ষার্থী ও প্রাক্তনীদের ফোন নম্বর ও ব্যক্তিগত তথ্য সুরক্ষিত রাখতে ডিরেক্টরিতে গোপনীয়তা রক্ষা করা হয়।
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-center gap-1 text-[11px] text-slate-500">
          <span>প্রতিষ্ঠাতা অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন এর স্মৃতির প্রতি বিনম্র শ্রদ্ধা</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
      </div>
    </footer>
  );
};
