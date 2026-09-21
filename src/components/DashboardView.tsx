import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImageUploaderBox } from './ImageUploaderBox';
import { 
  User as UserIcon, 
  Edit3, 
  Key, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Shield, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Save, 
  Share2,
  Lock,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  Globe,
  Heart,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentUser, updateProfile, changePassword, logout, setActiveTab, viewProfile } = useApp();

  const [activeTab, setActiveTabState] = useState<'profile' | 'edit' | 'security'>('profile');

  // Comprehensive Edit form states
  const [name, setName] = useState(currentUser?.name || '');
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  
  // Academic & School history
  const [batch, setBatch] = useState(currentUser?.batch || 'SSC 2026');
  const [sscYear, setSscYear] = useState(currentUser?.sscYear || '2026');
  const [admissionYear, setAdmissionYear] = useState(currentUser?.admissionYear || '2016');
  const [schoolYears, setSchoolYears] = useState(currentUser?.schoolYears || '২০১৬ – ২০২৬');
  const [classSection, setClassSection] = useState(currentUser?.classSection || '');
  const [rollNumber, setRollNumber] = useState(currentUser?.rollNumber || '');

  // Personal details
  const [fatherName, setFatherName] = useState(currentUser?.fatherName || '');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || 'B+');

  // Career, Occupation & Education
  const [currentOccupation, setCurrentOccupation] = useState(currentUser?.currentOccupation || '');
  const [organization, setOrganization] = useState(currentUser?.organization || '');
  const [higherEducation, setHigherEducation] = useState(currentUser?.higherEducation || '');
  const [location, setLocation] = useState(currentUser?.location || '');

  // Photos & Bio
  const [shortBio, setShortBio] = useState(currentUser?.shortBio || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.profilePhoto || '');
  const [coverPhoto, setCoverPhoto] = useState(currentUser?.coverPhoto || '');

  // Social & Web Links
  const [facebook, setFacebook] = useState(currentUser?.socialLinks?.facebook || '');
  const [linkedin, setLinkedin] = useState(currentUser?.socialLinks?.linkedin || '');
  const [github, setGithub] = useState(currentUser?.socialLinks?.github || '');
  const [instagram, setInstagram] = useState(currentUser?.socialLinks?.instagram || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.socialLinks?.whatsapp || '');
  const [website, setWebsite] = useState(currentUser?.socialLinks?.website || '');

  // Privacy setting
  const [showEmailPhone, setShowEmailPhone] = useState<boolean>(currentUser?.showEmailPhone ?? false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passNotice, setPassNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!currentUser) {
    return (
      <div className="py-16 text-center space-y-4">
        <Lock className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">অনুগ্রহ করে লগইন করুন</h2>
        <p className="text-slate-500 text-sm">প্রাক্তনী ড্যাশবোর্ড ব্যবহারের জন্য আপনাকে অ্যাকাউন্টে লগইন করতে হবে।</p>
        <button
          onClick={() => setActiveTab('login')}
          className="px-5 py-2.5 bg-blue-900 text-white rounded-xl font-bold text-sm"
        >
          লগইন পেজে যান
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      email: email.trim(),
      phone: phone.trim() || undefined,
      batch: batch.trim(),
      sscYear: sscYear.trim() || undefined,
      admissionYear: admissionYear.trim() || undefined,
      schoolYears: schoolYears.trim() || undefined,
      classSection: classSection.trim() || undefined,
      rollNumber: rollNumber.trim() || undefined,
      fatherName: fatherName.trim() || undefined,
      bloodGroup: bloodGroup.trim() || undefined,
      currentOccupation: currentOccupation.trim(),
      organization: organization.trim() || undefined,
      higherEducation: higherEducation.trim() || undefined,
      location: location.trim(),
      shortBio: shortBio.trim(),
      profilePhoto: profilePhoto.trim(),
      coverPhoto: coverPhoto.trim() || undefined,
      showEmailPhone,
      socialLinks: {
        facebook: facebook.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        github: github.trim() || undefined,
        instagram: instagram.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        website: website.trim() || undefined,
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPassNotice({ type: 'error', text: 'পাসওয়ার্ড দুটি মিলছে না।' });
      return;
    }
    const res = changePassword(newPassword);
    setPassNotice({ type: 'success', text: res.message });
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassNotice(null), 3000);
  };

  return (
    <div id="user-dashboard-page" className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Account Status Hero Banner */}
      <div className={`p-6 rounded-3xl border shadow-xs ${
        currentUser.status === 'approved'
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/80 border-amber-200 text-amber-950'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white ${
                currentUser.status === 'approved' ? 'bg-emerald-600' : 'bg-amber-600'
              }`}>
                {currentUser.status === 'approved' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {currentUser.batch} • {currentUser.classSection || 'মুকুল নিকেতন'} • {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="dashboard-view-public-profile-btn"
              onClick={() => viewProfile(currentUser.id)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-900" />
              <span>পাবলিক কার্ড দেখুন</span>
            </button>
            <button
              id="dashboard-logout-btn"
              onClick={logout}
              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Status explanation */}
        <div className="mt-4 pt-3 border-t border-black/5 text-xs text-slate-600 leading-relaxed">
          {currentUser.status === 'approved' ? (
            <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>আপনার অ্যাকাউন্টটি যাচাইকৃত ও উন্মুক্ত। সহপাঠীরা আপনাকে প্রাক্তন শিক্ষার্থী ডিরেক্টরিতে খুঁজে পাবেন।</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-900 font-medium">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>আপনার আবেদনটি বর্তমানে যাচাইয়ের অপেক্ষায় রয়েছে। কমিটি দ্বারা অনুমোদিত হওয়ার সাথে সাথে আপনার প্রোফাইল সাধারণ ডিরেক্টরিতে দৃশ্যমান হবে।</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold">
        <button
          id="dash-tab-profile"
          onClick={() => setActiveTabState('profile')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>আমার প্রোফাইল</span>
        </button>

        <button
          id="dash-tab-edit"
          onClick={() => setActiveTabState('edit')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'edit'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>প্রোফাইল সম্পাদনা</span>
        </button>

        <button
          id="dash-tab-security"
          onClick={() => setActiveTabState('security')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>পাসওয়ার্ড পরিবর্তন</span>
        </button>
      </div>

      {/* Tab 1: Profile View */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য</h2>
              <p className="text-xs text-slate-500 mt-0.5">আপনার অ্যাকাউন্টে সংরক্ষিত বিস্তারিত প্রোফাইল ডাটা</p>
            </div>
            <button
              onClick={() => setActiveTabState('edit')}
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold border border-blue-200 transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>তথ্য সম্পাদনা করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Academic Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                <BookOpen className="w-4 h-4" />
                <span>মুকুল নিকেতনের শিক্ষাবর্ষ তথ্য</span>
              </div>
              
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">এসএসসি ব্যাচ</span>
                <span className="font-bold text-blue-900 px-2 py-0.5 bg-blue-100 rounded text-xs">{currentUser.batch}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">এসএসসি বছর</span>
                <span className="font-semibold text-slate-800">{currentUser.sscYear || currentUser.batch.replace(/\D/g, '') || '২০২৬'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">ভর্তির সাল</span>
                <span className="font-semibold text-slate-800">{currentUser.admissionYear || '২০১৬'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">স্কুল বর্ষসীমা</span>
                <span className="font-semibold text-slate-800">{currentUser.schoolYears || '২০১৬ – ২০২৬'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">শ্রেণি ও শাখা</span>
                <span className="font-semibold text-slate-800">{currentUser.classSection || 'N/A'}</span>
              </div>

              {currentUser.rollNumber && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">রোল নম্বর / আইডি</span>
                  <span className="font-mono font-bold text-slate-800">{currentUser.rollNumber}</span>
                </div>
              )}
            </div>

            {/* Occupation & Personal Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                <Briefcase className="w-4 h-4" />
                <span>পেশা, অবস্থান ও পরিচয়</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">ডাকনাম</span>
                <span className="font-semibold text-slate-800">{currentUser.nickname || 'প্রযোজ্য নয়'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">রক্তের গ্রুপ</span>
                <span className="font-bold text-rose-600 px-2 py-0.5 bg-rose-50 border border-rose-200 rounded text-xs">{currentUser.bloodGroup || 'B+'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">বর্তমান পেশা</span>
                <span className="font-semibold text-slate-800">{currentUser.currentOccupation || 'শিক্ষার্থী'}</span>
              </div>

              {currentUser.organization && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">প্রতিষ্ঠান / কর্মস্থল</span>
                  <span className="font-semibold text-slate-800">{currentUser.organization}</span>
                </div>
              )}

              {currentUser.higherEducation && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">উচ্চশিক্ষা</span>
                  <span className="font-semibold text-slate-800">{currentUser.higherEducation}</span>
                </div>
              )}

              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">বর্তমান বাসস্থান</span>
                <span className="font-semibold text-slate-800">{currentUser.location || 'ময়মনসিংহ, বাংলাদেশ'}</span>
              </div>
            </div>
          </div>

          {currentUser.shortBio && (
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">স্মৃতি ও আত্মপরিচয়</div>
              <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                "{currentUser.shortBio}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Edit Profile Form */}
      {activeTab === 'edit' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSaveProfile} className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">সম্পূর্ণ প্রোফাইল তথ্য সম্পাদনা</h2>
              <p className="text-xs text-slate-500 mt-1">
                এখানে আপনার এসএসসি ব্যাচ, ভর্তির সাল, শ্রেণি, রক্তের গ্রুপ, পেশা এবং যোগাযোগের তথ্য নিখুঁতভাবে আপডেট করতে পারেন।
              </p>
            </div>

            {saveSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>আপনার সকল প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!</span>
              </div>
            )}

            {/* SECTION 1: Personal & Identification Info */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                <UserIcon className="w-4 h-4 text-blue-900" />
                <span>১. মৌলিক ও ব্যক্তিগত পরিচয়</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ডাকনাম (যদি থাকে)</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="যেমন: অনিক"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden font-bold text-rose-700"
                  >
                    <option value="A+">A+ (A Positive)</option>
                    <option value="A-">A- (A Negative)</option>
                    <option value="B+">B+ (B Positive)</option>
                    <option value="B-">B- (B Negative)</option>
                    <option value="O+">O+ (O Positive)</option>
                    <option value="O-">O- (O Negative)</option>
                    <option value="AB+">AB+ (AB Positive)</option>
                    <option value="AB-">AB- (AB Negative)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পিতা / অভিভাবকের নাম</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="পিতার নাম লিখুন"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১XXXXXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Mukul Niketan School & Academic History */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                <BookOpen className="w-4 h-4 text-blue-900" />
                <span>২. মুকুল নিকেতনের শিক্ষাবর্ষ ও ব্যাচ তথ্য</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">এসএসসি ব্যাচ (SSC Batch)</label>
                  <input
                    type="text"
                    required
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="যেমন: SSC 2026, SSC 2018"
                    className="w-full px-3 py-2 text-xs font-bold text-blue-900 rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">এসএসসি পাসের সাল</label>
                  <input
                    type="text"
                    value={sscYear}
                    onChange={(e) => setSscYear(e.target.value)}
                    placeholder="যেমন: 2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তির সাল (Admission Year)</label>
                  <input
                    type="text"
                    value={admissionYear}
                    onChange={(e) => setAdmissionYear(e.target.value)}
                    placeholder="যেমন: 2016"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্কুলে অধ্যয়নের সময়কাল</label>
                  <input
                    type="text"
                    value={schoolYears}
                    onChange={(e) => setSchoolYears(e.target.value)}
                    placeholder="যেমন: ২০১৬ – ২০২৬"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি, শাখা ও শিফট</label>
                  <input
                    type="text"
                    value={classSection}
                    onChange={(e) => setClassSection(e.target.value)}
                    placeholder="যেমন: Class 10, Section B (Morning)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">রোল নম্বর / স্টুডেন্ট আইডি</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="যেমন: ০৪"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Career, Occupation & Higher Education */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                <Briefcase className="w-4 h-4 text-blue-900" />
                <span>৩. বর্তমান অবস্থান, পেশা ও উচ্চশিক্ষা</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান পেশা / পদবি</label>
                  <input
                    type="text"
                    value={currentOccupation}
                    onChange={(e) => setCurrentOccupation(e.target.value)}
                    placeholder="যেমন: শিক্ষার্থী, আনন্দ মোহন কলেজ / সফটওয়্যার প্রকৌশলী"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান প্রতিষ্ঠান / কোম্পানি / কর্মস্থল</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="যেমন: নটর ডেম কলেজ / গুগল"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">উচ্চশিক্ষা / কলেজ / বিশ্ববিদ্যালয়</label>
                  <input
                    type="text"
                    value={higherEducation}
                    onChange={(e) => setHigherEducation(e.target.value)}
                    placeholder="যেমন: বিএসসি, সিএসই (ঢাকা বিশ্ববিদ্যালয়)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান শহর বা বাসস্থান</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="যেমন: ময়মনসিংহ / ঢাকা, বাংলাদেশ"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Photos & Bio */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                <Camera className="w-4 h-4 text-blue-900" />
                <span>৪. প্রোফাইল ও কভার ছবি এবং বায়ো</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploaderBox
                  label="প্রোফাইল ছবি নির্বাচন (Profile Photo)"
                  value={profilePhoto}
                  onChange={(url) => setProfilePhoto(url)}
                  aspect="square"
                  placeholder="প্রোফাইল ছবি সিলেক্ট করুন"
                />

                <ImageUploaderBox
                  label="কভার ব্যানার নির্বাচন (Cover Banner)"
                  value={coverPhoto}
                  onChange={(url) => setCoverPhoto(url)}
                  aspect="banner"
                  placeholder="কভার ব্যানার ছবি সিলেক্ট করুন"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত স্মৃতিকথা বা আত্মপরিচয় (Short Bio)</label>
                <textarea
                  rows={3}
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  placeholder="মুকুল নিকেতনের বন্ধুদের জন্য আপনার সংক্ষিপ্ত বার্তা বা বিদ্যালয় জীবনের স্মৃতি লিখুন..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden resize-none"
                />
              </div>
            </div>

            {/* SECTION 5: Social & Contact Links */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">
                <Globe className="w-4 h-4 text-blue-900" />
                <span>৫. সোশ্যাল মিডিয়া ও যোগাযোগের লিংকসমূহ (ঐচ্ছিক)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="ফেসবুক প্রোফাইল URL"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                />
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="লিঙ্কডইন প্রোফাইল URL"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="হোয়াটসঅ্যাপ নম্বর / লিংক"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                />
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="ইনস্টাগ্রাম প্রোফাইল URL"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                />
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="গিটহাব প্রোফাইল URL"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="ব্যক্তিগত ওয়েবসাইট URL"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* SECTION 6: Privacy Setting */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-amber-700" />
                <span>৬. ডিরেক্টরি দৃশ্যমানতা ও গোপনীয়তা সেটিংস</span>
              </div>
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={showEmailPhone}
                  onChange={(e) => setShowEmailPhone(e.target.checked)}
                  className="mt-0.5 rounded text-blue-900 focus:ring-blue-900 w-4 h-4 border-slate-300"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-bold">আমার ইমেইল ও ফোন নম্বর সাধারণ ডিরেক্টরিতে উন্মুক্ত রাখুন</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    (আনচেক রাখা হলে শুধুমাত্র অনুমোদিত সদস্যরাই ডিরেক্টরি থেকে সাধারণ তথ্যাদি পাবেন, সরাসরি ফোন/ইমেইল গোপন থাকবে)
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                id="save-profile-changes-btn"
                className="px-8 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>সব তথ্য সংরক্ষণ করুন (Save All Changes)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-lg">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">পাসওয়ার্ড পরিবর্তন</h2>

            {passNotice && (
              <div className={`p-3 text-xs rounded-xl border ${
                passNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {passNotice.text}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড লিখুন"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড পুনরায় লিখুন</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              id="submit-password-change-btn"
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              পাসওয়ার্ড হালনাগাদ করুন
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
