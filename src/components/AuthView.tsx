import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogIn, 
  UserPlus, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon, 
  School,
  Phone,
  Calendar,
  Briefcase,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { currentUser, login, register, logout, setActiveTab } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form states
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [batch, setBatch] = useState('SSC 2026');
  const [classSection, setClassSection] = useState('');
  const [currentOccupation, setCurrentOccupation] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [location, setLocation] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim()) {
      setLoginError('অনুগ্রহ করে আপনার ইমেইল ঠিকানা বা ফোন নম্বর লিখুন।');
      return;
    }

    const res = login(loginIdentifier.trim());
    if (res.success) {
      setActiveTab('dashboard');
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessMessage(null);

    if (currentUser) {
      setRegError('লগইন থাকা অবস্থায় নতুন অ্যাকাউন্ট তৈরি করা যাবে না। অনুগ্রহ করে প্রথমে লগআউট করুন।');
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim() || !batch.trim()) {
      setRegError('অনুগ্রহ করে আবশ্যকীয় তথ্যগুলো পূরণ করুন (নাম, ইমেইল, ফোন ও ব্যাচ)।');
      return;
    }

    const res = register({
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      email: email.trim(),
      phone: phone.trim(),
      batch: batch.trim(),
      classSection: classSection.trim(),
      currentOccupation: currentOccupation.trim() || 'শিক্ষার্থী / প্রাক্তনী',
      shortBio: shortBio.trim(),
      location: location.trim(),
      profilePhoto: profilePhoto.trim() || undefined
    });

    if (res.success) {
      setRegSuccessMessage(res.message);
      setTimeout(() => {
        setActiveTab('dashboard');
      }, 1800);
    } else {
      setRegError(res.message);
    }
  };

  return (
    <div id="auth-page" className="max-w-xl mx-auto pb-16 pt-4">
      {/* Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Branding */}
        <div className="bg-slate-900 text-white p-6 text-center border-b border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>নিরাপদ ও সংরক্ষিত প্রবেশদ্বার</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">মুকুল নিকেতন উচ্চ বিদ্যালয়, ময়মনসিংহ</h1>
          <p className="text-xs text-slate-300 font-medium">প্রাক্তন শিক্ষার্থী ও প্রাতিষ্ঠানিক পোর্টাল</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 p-1.5 m-3 rounded-xl">
          <button
            id="tab-login-btn"
            onClick={() => { setMode('login'); setLoginError(null); }}
            className={`py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>প্রাক্তন শিক্ষার্থী লগইন</span>
          </button>
          <button
            id="tab-register-btn"
            onClick={() => { setMode('register'); setRegError(null); }}
            className={`py-2.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>নতুন সদস্য নিবন্ধন</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {currentUser ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-800">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-extrabold text-slate-900">
                  আপনি ইতিমধ্যেই লগইন অবস্থায় আছেন
                </h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  বর্তমান সদস্য: <span className="font-bold text-slate-900">{currentUser.name}</span> ({currentUser.email || currentUser.phone})
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-none max-w-md mx-auto mt-2 leading-relaxed">
                  নিরাপত্তা নীতি অনুযায়ী, একটি সক্রিয় অ্যাকাউন্ট থেকে কোনোভাবেই নতুন অ্যাকাউন্ট তৈরি করা যাবে না।
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 max-w-md mx-auto">
                <button
                  id="already-logged-in-community-btn"
                  onClick={() => setActiveTab('community')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-none transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-amber-300" />
                  <span>আলাপ পাতায় যান</span>
                </button>
                <button
                  id="already-logged-in-dashboard-btn"
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-none transition"
                >
                  <span>আমার ড্যাশবোর্ড</span>
                </button>
                <button
                  id="already-logged-in-logout-btn"
                  onClick={() => logout()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 rounded-none transition"
                >
                  <span>লগআউট</span>
                </button>
              </div>
            </div>
          ) : mode === 'login' ? (
            /* Login Form */
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">প্রাক্তনী অ্যাকাউন্ট লগইন</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার নিবন্ধিত ইমেইল ঠিকানা বা ফোন নম্বর দিয়ে লগইন করুন।
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ইমেইল ঠিকানা অথবা ফোন নম্বর
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-email-input"
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="যেমন: yourname@gmail.com বা ০১৭১..."
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password-input"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন"
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-login-btn"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-none shadow-xs transition flex items-center justify-center gap-2"
                >
                  <span>লগইন করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="pt-2 border-t border-slate-200">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-none text-xs text-slate-700 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>নিরাপত্তা ও অ্যাক্সেস নীতিমালা</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    শুধুমাত্র মুকুল নিকেতন উচ্চ বিদ্যালয়ের ভেরিফাইড প্রাক্তনী ও অনুমোদিত কর্মকর্তা-শিক্ষকমণ্ডলী পাসওয়ার্ড যাচাইয়ের মাধ্যমে সিস্টেমে প্রবেশ করতে পারবেন।
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">প্রাক্তন শিক্ষার্থী নিবন্ধন</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  মুকুল নিকেতন উচ্চ বিদ্যালয়ের অফিশিয়াল ডিজিটাল অ্যালামনাই ডিরেক্টরিতে যুক্ত হোন।
                </p>
              </div>

              {/* Status Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <School className="w-3.5 h-3.5 text-blue-800" />
                  <span>ভেরিফিকেশন ও অনুমোদন নির্দেশিকা</span>
                </div>
                <p className="text-[11px] text-blue-900/90 leading-relaxed">
                  নিবন্ধনের পর আপনার প্রোফাইলটি বিদ্যালয়ের প্রাক্তন শিক্ষার্থী কমিটি দ্বারা যাচাই হবে। অনুমোদন সম্পন্ন হলে আপনার প্রোফাইল সাধারণ ডিরেক্টরিতে দৃশ্যমান হবে।
                </p>
              </div>

              {regSuccessMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">আবেদন গৃহীত হয়েছে!</div>
                    <p className="mt-0.5 text-[11px]">{regSuccessMessage}</p>
                  </div>
                </div>
              )}

              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পূর্ণ নাম *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="reg-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ডাকনাম (যদি থাকে)
                    </label>
                    <input
                      id="reg-nickname-input"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="ডাকনাম (ঐচ্ছিক)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ইমেইল ঠিকানা *
                    </label>
                    <input
                      id="reg-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="আপনার ইমেইল ঠিকানা"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      id="reg-phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="আপনার মোবাইল নম্বর"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ব্যাচ (এসএসসি পাসের বছর) *
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        id="reg-batch-input"
                        required
                        value={batch.replace(/\D/g, '') || '2026'}
                        onChange={(e) => setBatch(`SSC ${e.target.value}`)}
                        className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden cursor-pointer"
                      >
                        {Array.from({ length: 61 }, (_, i) => 2030 - i).map(year => (
                          <option key={year} value={year}>
                            {year} (এসএসসি {year})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      শাখা / বিভাগ
                    </label>
                    <input
                      id="reg-class-section-input"
                      type="text"
                      value={classSection}
                      onChange={(e) => setClassSection(e.target.value)}
                      placeholder="যেমন: বিজ্ঞান বিভাগ / শাখা ক"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পাসওয়ার্ড *
                    </label>
                    <input
                      id="reg-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড নির্ধারণ করুন"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বর্তমান পেশা / অধ্যয়নরত প্রতিষ্ঠান
                    </label>
                    <input
                      id="reg-occupation-input"
                      type="text"
                      value={currentOccupation}
                      onChange={(e) => setCurrentOccupation(e.target.value)}
                      placeholder="বর্তমান পেশা বা অধ্যয়নরত প্রতিষ্ঠান"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সংক্ষিপ্ত স্মৃতি বা পরিচয়
                  </label>
                  <textarea
                    id="reg-bio-input"
                    rows={2}
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    placeholder="মুকুল নিকেতন ক্যাম্পাসের প্রিয় কোনো স্মৃতি বা বর্তমান পরিচয়..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-register-btn"
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  নিবন্ধনের আবেদন জমা দিন
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
