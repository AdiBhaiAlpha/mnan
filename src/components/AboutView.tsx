import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Users, 
  Compass, 
  Music, 
  Globe, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  School,
  Home as HomeIcon,
  Flag
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActiveTab, currentUser } = useApp();
  const [activeSubSection, setActiveSubSection] = useState<'overview' | 'history' | 'infrastructure' | 'cocurricular' | 'founder'>('overview');

  const schoolFacts = [
    { label: 'প্রতিষ্ঠানের নাম', labelEn: 'Institution Name', value: 'মুকুল নিকেতন উচ্চ বিদ্যালয়, ময়মনসিংহ', valueEn: 'Mukul Niketon High School (MNHS)' },
    { label: 'ইআইআইএন (EIIN)', labelEn: 'EIIN Number', value: '১১১৮৪৭ (111847)', valueEn: '111847' },
    { label: 'প্রতিষ্ঠাকাল', labelEn: 'Established', value: '১৯৭০ খ্রিষ্টাব্দ (৫৫ বছর পূর্বে)', valueEn: '1970 (55+ Years of Legacy)' },
    { label: 'প্রতিষ্ঠাতা', labelEn: 'Founder', value: 'অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন (প্রয়াত) ও ময়মনসিংহ জেলা মুকুল ফৌজ', valueEn: 'Principal Amir Ahammad Chowdhury Ratan & Mymensingh District Mukul Fouj' },
    { label: 'প্রধান শিক্ষক কার্যালয়', labelEn: 'Headmaster Office', value: 'প্রধান শিক্ষক কার্যালয়, মুকুল নিকেতন উচ্চ বিদ্যালয়', valueEn: 'Headmaster Office, Mukul Niketon High School' },
    { label: 'প্রতিষ্ঠান ধরন', labelEn: 'Institution Type', value: 'বেসরকারি উচ্চ বিদ্যালয় (Private Secondary School)', valueEn: 'Private High School' },
    { label: 'শিক্ষাদান পর্যায়', labelEn: 'Class Range', value: 'নার্সারি হতে দশম শ্রেণি (Nursery – Class 10)', valueEn: 'Nursery to Class 10 (Secondary)' },
    { label: 'ক্যাম্পাস আয়তন', labelEn: 'Campus Size', value: 'প্রায় ১ একর (1 Acre)', valueEn: 'Approx. 1 Acre in Mymensingh City Center' },
    { label: 'অবস্থান', labelEn: 'Location', value: '১০, মহারাজা রোড, ময়মনসিংহ-২২০০, বাংলাদেশ', valueEn: '10, Maharaja Road, Mymensingh-2200, Bangladesh' },
    { label: 'ল্যান্ডমার্ক', labelEn: 'Landmark', value: 'শ্রী শ্রী কানাই মন্দিরের পাশে, ময়মনসিংহ রেলওয়ে স্টেশনের সন্নিকটে', valueEn: 'Near Sri Sri Kanai Temple & Mymensingh Railway Station' },
    { label: 'শিক্ষার্থী সংখ্যা', labelEn: 'Students Enrolled', value: '৪,০০০+ শিক্ষার্থী', valueEn: '4,000+ Active Students' },
    { label: 'দাপ্তরিক ওয়েবসাইট', labelEn: 'Official Website', value: 'mukulniketonhs.edu.bd', valueEn: 'mukulniketonhs.edu.bd', isLink: true }
  ];

  return (
    <div id="about-school-page" className="space-y-10 pb-20 pt-2">
      {/* Top Academic Banner */}
      <section className="bg-slate-900 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-md">
        <div className="p-6 sm:p-10 lg:p-12 relative">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold tracking-wide">
              <School className="w-3.5 h-3.5 text-amber-400" />
              <span>EIIN: ১১১৮৪৭ • প্রতিষ্ঠাকাল: ১৯৭০ • ময়মনসিংহ</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                মুকুল নিকেতন উচ্চ বিদ্যালয়, ময়মনসিংহ
              </h1>
              <p className="text-base sm:text-xl font-medium text-slate-300">
                মুকুল নিকেতন উচ্চ বিদ্যালয় (এমএনএইচএস) — ময়মনসিংহ, বাংলাদেশ
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl pt-1">
              ১৯৭০ সালে অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন এর হাতে প্রতিষ্ঠিত বাংলাদেশের অন্যতম ঐতিহ্যবাহী ও শীর্ষস্থানীয় বেসরকারি শিক্ষাপ্রতিষ্ঠান। বিগত অর্ধশতাব্দীরও বেশি সময় ধরে জ্ঞানের আলো, মানবিক মূল্যবোধ ও সাংস্কৃতিক ঐতিহ্য বিকাশে অগ্রণী ভূমিকা পালন করে আসছে।
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>১০, মহারাজা রোড, ময়মনসিংহ</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>প্রতিষ্ঠিত: ১৯৭০ খ্রিষ্টাব্দ</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>৪,০০০+ শিক্ষার্থী</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Pill Bar */}
        <div className="bg-slate-950/80 border-t border-slate-800 px-4 sm:px-8 py-2.5 flex flex-wrap items-center gap-2 text-xs">
          <button
            id="about-subnav-overview"
            onClick={() => setActiveSubSection('overview')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeSubSection === 'overview'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            সংক্ষিপ্ত তথ্য ও পরিচিতি
          </button>
          <button
            id="about-subnav-history"
            onClick={() => setActiveSubSection('history')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeSubSection === 'history'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            গৌরবময় ইতিহাস
          </button>
          <button
            id="about-subnav-infrastructure"
            onClick={() => setActiveSubSection('infrastructure')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeSubSection === 'infrastructure'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            অবস্থান ও অবকাঠামো
          </button>
          <button
            id="about-subnav-cocurricular"
            onClick={() => setActiveSubSection('cocurricular')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeSubSection === 'cocurricular'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            সহ-শিক্ষা ও সাংস্কৃতিক ঐতিহ্য
          </button>
          <button
            id="about-subnav-founder"
            onClick={() => setActiveSubSection('founder')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeSubSection === 'founder'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            প্রতিষ্ঠাতা স্মরণে
          </button>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Detailed Content Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Overview */}
          {(activeSubSection === 'overview' || activeSubSection === 'history') && (
            <section id="about-history-section" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
                  <BookOpen className="w-4 h-4 text-blue-800" />
                  <span>ইতিহাস ও প্রতিষ্ঠার পটভূমি • গৌরবময় ঐতিহ্য</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  বাঁশের টালাইয়ের ছাউনি থেকে বিদ্যাপীঠের মহীরূহ
                </h2>
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                <p>
                  <strong>মুকুল নিকেতন উচ্চ বিদ্যালয়</strong> বাংলাদেশের ময়মনসিংহ শহরের একটি অনন্য ও ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। এটি <strong>১৯৭০ সালে</strong> প্রখ্যাত শিক্ষাবিদ ও সমাজসেবক <strong>অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন</strong> এর দূরদর্শী নেতৃত্বে যাত্রা শুরু করে।
                </p>
                <div className="bg-slate-50 border-l-4 border-blue-900 p-4 rounded-r-xl text-slate-800 my-4 text-sm leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">
                    “অসহায়, গরীব ও দুস্থ ছেলে-মেয়েদের বিনা বেতনে শিক্ষাদানের মাধ্যমে বিদ্যালয়টির পথচলা শুরু হয়।”
                  </p>
                  <p className="text-xs text-slate-600">
                    শুরুর দিনগুলোতে বাঁশের টালাইয়ের বেড়া ও ছাউনির নিচে মাত্র কয়েকজন শিক্ষার্থী নিয়ে পাঠদান শুরু হয়েছিল। অধ্যক্ষ রতনের অক্লান্ত পরিশ্রম ও ময়মনসিংহ জেলা মুকুল ফৌজের নিঃস্বার্থ আত্মত্যাগে এই প্রতিষ্ঠানটি রূপ নেয় এক অনন্য শিক্ষাঙ্গনে।
                  </p>
                </div>
                <p>
                  সময়ের পরিক্রমায় বিদ্যালয়টি ময়মনসিংহের অন্যতম শীর্ষ বেসরকারি বিদ্যালয়ে পরিণত হয়। বিদ্যালয়টির শৃঙ্খলা, শিক্ষাদানের আধুনিক পরিবেশ ও শিক্ষক-শিক্ষার্থীর আন্তরিক সম্পর্কের কারণে প্রতি বছর হাজার হাজার অভিভাবক তাদের সন্তানদের এই বিদ্যাপীঠে পাঠানোর জন্য আস্থা প্রকাশ করেন। বর্তমানে নার্সারি থেকে দশম শ্রেণি পর্যন্ত প্রায় ৪,০০০ এর অধিক শিক্ষার্থী নিয়মিত অধ্যয়ন করছে।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-extrabold text-blue-950">১৯৭০</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">প্রতিষ্ঠা সন</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-extrabold text-blue-950">৫৫+</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">বছরের গৌরবময় ঐতিহ্য</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-extrabold text-blue-950">৪,০০০+</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">অধ্যয়নরত শিক্ষার্থী</div>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Infrastructure & Location */}
          {(activeSubSection === 'overview' || activeSubSection === 'infrastructure') && (
            <section id="about-campus-section" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
                  <Building2 className="w-4 h-4 text-blue-800" />
                  <span>অবস্থান ও অবকাঠামো • ক্যাম্পাস পরিবেশ</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  ক্যাম্পাস পরিবেশ ও আবাসিক সুবিধা
                </h2>
              </div>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  বিদ্যালয়টি ময়মনসিংহ শহরের কেন্দ্রস্থলে <strong>১০, মহারাজা রোডে</strong> অবস্থিত। ঐতিহাসিক শ্রী শ্রী কানাই মন্দিরের পাশে এবং ময়মনসিংহ রেলওয়ে স্টেশনের সন্নিকটে প্রায় <strong>১ একর জমির</strong> উপর মনোরম পরিবেশে ক্যাম্পাসটি গড়ে উঠেছে।
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                      <School className="w-4 h-4 text-blue-800" />
                      <span>ছেলে ও মেয়েদের পৃথক পৃথক ভবন</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      সুশৃঙ্খল শিক্ষার জন্য ছাত্র এবং ছাত্রীদের জন্য সুসজ্জিত বহুতল পৃথক একাডেমিক ভবন বিদ্যমান, যেখানে প্রশস্ত শ্রেণিকক্ষ, আধুনিক ল্যাব ও পাঠদানের পরিবেশ রয়েছে।
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                      <HomeIcon className="w-4 h-4 text-blue-800" />
                      <span>ছেলেদের জন্য আবাসিক হোস্টেল</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      ময়মনসিংহ ও পাশ্ববর্তী জেলা থেকে আগত শিক্ষার্থীদের জন্য রয়েছে সুশৃঙ্খল ও নিরাপদ নিজস্ব আবাসিক হোস্টেল সুবিধা।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">ক্যাম্পাস ঠিকানা:</strong> ১০, মহারাজা রোড (শ্রী শ্রী কানাই মন্দিরের পাশে), ময়মনসিংহ-২২০০, বাংলাদেশ। ময়মনসিংহ জংশন রেলওয়ে স্টেশন ও গাঙ্গিনাপাড় বাজার থেকে খুব সহজেই রিকশা বা পায়ে হেঁটে পৌঁছানো যায়।
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Co-Curricular Excellence */}
          {(activeSubSection === 'overview' || activeSubSection === 'cocurricular') && (
            <section id="about-activities-section" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
                  <Award className="w-4 h-4 text-blue-800" />
                  <span>সহ-শিক্ষা ও সাংস্কৃতিক অর্জন • জাতীয় সম্মাননা</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  সাংস্কৃতিক ঐতিহ্য ও জাতীয় পর্যায়ের সম্মাননা
                </h2>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                কেবল পুঁথিগত বিদ্যায় নয়, শিক্ষার্থীদের মানবিক গুণাবলী, সৃজনশীলতা এবং নেতৃত্বের বিকাশে মুকুল নিকেতন সবসময় অগ্রগামী। প্রতিষ্ঠালগ্ন থেকেই এই বিদ্যালয়ে নিয়মিত সহ-শিক্ষা ও সাংস্কৃতিক কার্যক্রম পরিচালিত হয়ে আসছে।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-blue-300 transition">
                  <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                    <Music className="w-4 h-4 text-amber-600" />
                    <span>নাচ, গান ও আবৃত্তি শিক্ষা</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    বিদ্যালয়ের নিজস্ব সংগীত ও সাংস্কৃতিক শাখায় নিয়মিত নাচ, রবীন্দ্র ও নজরুল সংগীত, দেশাত্মবোধক গান এবং আবৃত্তি প্রশিক্ষণ প্রদান করা হয়।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-blue-300 transition">
                  <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                    <MessageSquareIcon className="w-4 h-4 text-blue-700" />
                    <span>মুকুল নিকেতন বিতর্ক ক্লাব (Debate Club)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    যুক্তিনির্ভর চিন্তার প্রসারে বিদ্যালয়ের বিতর্ক ক্লাব জেলা ও জাতীয় পর্যায়ের বহু বিতর্ক প্রতিযোগিতায় চ্যাম্পিয়ন হওয়ার গৌরব অর্জন করেছে।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-blue-300 transition">
                  <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>সমৃদ্ধ বিদ্যালয় পাঠাগার (Library)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    হাজারো বইয়ের সমাহারে সজ্জিত পাঠাগার শিক্ষার্থীদের মধ্যে নিয়মিত বই পড়ার অভ্যাস গড়ে তুলতে ভূমিকা রাখছে।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-blue-300 transition">
                  <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                    <Flag className="w-4 h-4 text-red-600" />
                    <span>স্কাউট ও গার্ল গাইড দল</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    বিদ্যালয়ের চৌকস স্কাউট দল সমাজসেবা, জাতীয় সমাবেশ ও কুচকাওয়াজে কৃতিত্বপূর্ণ অবদান রেখে আসছে।
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-2 text-amber-300">
                  <Award className="w-4 h-4" />
                  <span>জাতীয় পুরস্কার ও স্বীকৃতি</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  মুকুল নিকেতন উচ্চ বিদ্যালয়ের শিক্ষার্থীরা বিভিন্ন সাংস্কৃতিক প্রতিযোগিতা, বিতর্ক উৎসব, শিশু একাডেমি ও জাতীয় শিক্ষা সপ্তাহে বহুবার জাতীয় পদক ও পুরস্কারে ভূষিত হয়েছে।
                </p>
              </div>
            </section>
          )}

          {/* Section 4: Founder Tribute */}
          {(activeSubSection === 'overview' || activeSubSection === 'founder') && (
            <section id="about-founder-section" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-blue-800" />
                  <span>প্রতিষ্ঠাতা স্মরণে • শ্রদ্ধার্ঘ্য ও স্মৃতিচারণ</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন — আলোর দিশারী
                </h2>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>
                  ময়মনসিংহের শিক্ষাঙ্গন ও সাংস্কৃতিক অঙ্গনের কিংবদন্তি ব্যক্তিত্ব <strong>প্রয়াত অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন</strong> ছিলেন এক মহান দূরদর্শী স্বপ্নদ্রষ্টা। তাঁর জীবন উৎসর্গিত ছিল অবহেলিত শিশু-কিশোরদের শিক্ষার অধিকার নিশ্চিতকরণে।
                </p>
                <p>
                  তিনি একাধারে ছিলেন বিশিষ্ট শিক্ষাবিদ, মুক্তিযুদ্ধের সংগঠক, ক্রীড়া সংগঠক এবং সাহিত্য-সাংস্কৃতিক আন্দোলনের অন্যতম অগ্রনায়ক। তাঁর মমতাময়ী দৃষ্টিভঙ্গি ও দৃঢ় নেতৃত্বের কারণেই মুকুল নিকেতন আজকের এই মর্যাদাপূর্ণ অবস্থানে অধিষ্ঠিত হয়েছে। তাঁর আদর্শ ও শিক্ষা আজও প্রতিটি শিক্ষক, শিক্ষার্থী ও প্রাক্তনীকে পথ দেখায়।
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Right 1 Column: Institutional Fact Sheet & Quick Access */}
        <div className="space-y-6">
          {/* Institutional Data Sheet Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-900" />
                <span>প্রাতিষ্ঠানিক তথ্যসারণী</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                অফিশিয়াল প্রাতিষ্ঠানিক তথ্য বিবরণী (এমএনএইচএস)
              </p>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {schoolFacts.map((fact, idx) => (
                <div key={idx} className="py-2.5 flex flex-col space-y-0.5">
                  <span className="text-slate-500 font-medium">{fact.label}</span>
                  {fact.isLink ? (
                    <a 
                      href={`https://${fact.value}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="font-bold text-blue-900 hover:underline flex items-center gap-1"
                    >
                      <span>{fact.value}</span>
                      <ExternalLink className="w-3 h-3 text-blue-700" />
                    </a>
                  ) : (
                    <span className="font-bold text-slate-900">{fact.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Connect & Alumni Registration Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>প্রাক্তন শিক্ষার্থী কমিউনিটি</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                আপনি কি মুকুল নিকেতন উচ্চ বিদ্যালয়ের প্রাক্তন শিক্ষার্থী? ডিজিটাল ডিরেক্টরিতে আপনার তথ্য যুক্ত করুন।
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {currentUser ? (
                <button
                  id="about-cta-register"
                  onClick={() => setActiveTab('community')}
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-none transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>আলাপ পাতায় যান</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="about-cta-register"
                  onClick={() => setActiveTab('register')}
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-none transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>প্রাক্তন শিক্ষার্থী নিবন্ধন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                id="about-cta-directory"
                onClick={() => setActiveTab('students')}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-blue-300" />
                <span>শিক্ষার্থী ডিরেক্টরি ব্রাউজ করুন</span>
              </button>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
            <div className="font-bold text-slate-900">বিদ্যালয় কার্যালয় যোগাযোগ</div>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>১০, মহারাজা রোড, ময়মনসিংহ-২২০০</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>+৮৮০ ৯১-৬৫৪০০</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>info@mukulniketonhs.edu.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>mukulniketonhs.edu.bd</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MessageSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
