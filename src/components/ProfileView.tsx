import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { saveUserToFirebase } from '../services/firebaseDb';
import { uploadImageToImgBB } from '../utils/imageUploader';
import { User } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Shield, 
  Edit3, 
  Globe, 
  Facebook, 
  Linkedin, 
  Github, 
  Instagram,
  Heart,
  GraduationCap,
  Phone,
  Mail,
  MessageCircle,
  X,
  Save,
  CheckCircle2,
  Sparkles,
  Camera,
  Loader2
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { selectedProfileId, users, currentUser, setActiveTab, updateProfile } = useApp();

  // Find user by selectedProfileId, or default to first student, or currentUser
  const profileUser = users.find(u => u.id === selectedProfileId) || 
                      users.find(u => u.role === 'student' && u.status === 'approved') || 
                      currentUser;

  const isOwnProfile = Boolean(currentUser && profileUser && currentUser.id === profileUser.id);

  // Edit form modal state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isJustSaved, setIsJustSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Image Upload State
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadToast, setUploadToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form fields state
  const [formData, setFormData] = useState({
    name: profileUser?.name || '',
    nickname: profileUser?.nickname || '',
    schoolYears: profileUser?.schoolYears || '',
    shortBio: profileUser?.shortBio || '',
    batch: profileUser?.batch || 'SSC 2026',
    sscYear: profileUser?.sscYear || profileUser?.batch?.replace(/\D/g, '') || '2026',
    phone: profileUser?.phone || '',
    email: profileUser?.email || '',
    location: profileUser?.location || '',
    currentOccupation: profileUser?.currentOccupation || '',
    organization: profileUser?.organization || '',
    higherEducation: profileUser?.higherEducation || '',
    facebook: profileUser?.socialLinks?.facebook || '',
    whatsapp: profileUser?.socialLinks?.whatsapp || '',
    linkedin: profileUser?.socialLinks?.linkedin || '',
    showEmailPhone: profileUser?.showEmailPhone ?? true,
  });

  // Sync form state whenever active profile user changes
  useEffect(() => {
    if (profileUser) {
      setFormData({
        name: profileUser.name || '',
        nickname: profileUser.nickname || '',
        schoolYears: profileUser.schoolYears || '',
        shortBio: profileUser.shortBio || '',
        batch: profileUser.batch || 'SSC 2026',
        sscYear: profileUser.sscYear || profileUser.batch?.replace(/\D/g, '') || '2026',
        phone: profileUser.phone || '',
        email: profileUser.email || '',
        location: profileUser.location || '',
        currentOccupation: profileUser.currentOccupation || '',
        organization: profileUser.organization || '',
        higherEducation: profileUser.higherEducation || '',
        facebook: profileUser.socialLinks?.facebook || '',
        whatsapp: profileUser.socialLinks?.whatsapp || '',
        linkedin: profileUser.socialLinks?.linkedin || '',
        showEmailPhone: profileUser.showEmailPhone ?? true,
      });
    }
  }, [profileUser]);

  if (!profileUser) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">প্রোফাইল পাওয়া যায়নি</h2>
        <p className="text-slate-500 text-sm">আপনি যে শিক্ষার্থীর প্রোফাইল খুঁজছেন তা খুঁজে পাওয়া যায়নি বা বিদ্যমান নেই।</p>
        <button
          onClick={() => setActiveTab('students')}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold cursor-pointer"
        >
          প্রাক্তন শিক্ষার্থী তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  // Direct Image Upload Handler via ImgBB API & Sync to Realtime Database
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profilePhoto' | 'coverPhoto') => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentUser || !profileUser) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setUploadToast({ text: 'অনুগ্রহ করে একটি ছবি ফাইল সিলেক্ট করুন (PNG, JPG, WEBP)।', type: 'error' });
      return;
    }

    if (field === 'profilePhoto') setIsUploadingAvatar(true);
    else setIsUploadingCover(true);

    setUploadToast(null);

    try {
      // 1. Upload file via ImgBB API
      const directUrl = await uploadImageToImgBB(file);
      
      const updatedUser: User = {
        ...profileUser,
        [field]: directUrl,
        id: currentUser.id
      };

      // 2. Update local React state
      updateProfile({ [field]: directUrl });

      // 3. Save directly to Firebase Realtime Database
      await saveUserToFirebase(updatedUser);

      setUploadToast({
        text: field === 'profilePhoto' 
          ? 'প্রোফাইল ছবি ImgBB-তে আপলোড হয়ে রিয়েলটাইম ডাটাবেসে সেভ হয়েছে!' 
          : 'কভার ফটো ImgBB-তে আপলোড হয়ে রিয়েলটাইম ডাটাবেসে সেভ হয়েছে!',
        type: 'success'
      });
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadToast({
        text: err?.message || 'ছবি আপলোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।',
        type: 'error'
      });
    } finally {
      if (field === 'profilePhoto') setIsUploadingAvatar(false);
      else setIsUploadingCover(false);

      if (e.target) e.target.value = '';

      setTimeout(() => {
        setUploadToast(null);
      }, 4000);
    }
  };

  // Submit profile update handler (Directly syncs to Realtime Database UID document)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    setSaveMessage('');

    const updatedData: Partial<User> = {
      name: formData.name.trim(),
      nickname: formData.nickname.trim(),
      schoolYears: formData.schoolYears.trim(),
      shortBio: formData.shortBio.trim(),
      batch: formData.batch.trim(),
      sscYear: formData.sscYear.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      location: formData.location.trim(),
      currentOccupation: formData.currentOccupation.trim(),
      organization: formData.organization.trim(),
      higherEducation: formData.higherEducation.trim(),
      showEmailPhone: formData.showEmailPhone,
      socialLinks: {
        ...(profileUser.socialLinks || {}),
        facebook: formData.facebook.trim(),
        whatsapp: formData.whatsapp.trim(),
        linkedin: formData.linkedin.trim(),
      }
    };

    // Update global React context immediately
    updateProfile(updatedData);

    const fullUpdatedUser: User = {
      ...profileUser,
      ...updatedData,
      id: currentUser.id
    };

    // Guarantee fast save feedback (around 800ms saving state then transition to green saved state)
    try {
      const saveTask = saveUserToFirebase(fullUpdatedUser);
      const minDelay = new Promise(res => setTimeout(res, 800));
      await Promise.all([saveTask, minDelay]);

      setIsSaving(false);
      setIsJustSaved(true);
      setSaveMessage('আপনার তথ্য সফলভাবে সেভ হয়েছে!');
      setUploadToast({
        text: 'আপনার প্রোফাইল তথ্য সফলভাবে সেভ হয়েছে!',
        type: 'success'
      });

      // Show green saved confirmation button & banner for 2 seconds before closing modal
      setTimeout(() => {
        setIsJustSaved(false);
        setIsEditingProfile(false);
        setSaveMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setIsSaving(false);
      setSaveMessage('সেভ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setUploadToast({
        text: 'সেভ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        type: 'error'
      });
    }
  };

  return (
    <div id="individual-profile-page" className="max-w-4xl mx-auto space-y-6 pb-16 relative">
      {/* Toast alert notification for image upload status */}
      {uploadToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2.5 border animate-in fade-in slide-in-from-bottom-4 duration-200 ${
          uploadToast.type === 'success' 
            ? 'bg-slate-900 text-white border-emerald-500/50 shadow-emerald-950/20' 
            : 'bg-rose-950 text-white border-rose-500/50 shadow-rose-950/20'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadToast.text}</span>
        </div>
      )}

      {/* Navigation breadcrumb */}
      <button
        id="back-to-directory-btn"
        onClick={() => setActiveTab('students')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-900 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>প্রাক্তন শিক্ষার্থী তালিকায় ফিরে যান</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs relative">
        {/* Cover Photo Banner with Bottom-Right Upload Button */}
        <div 
          className="h-44 sm:h-56 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 relative bg-cover bg-center group"
          style={profileUser.coverPhoto ? { backgroundImage: `url(${profileUser.coverPhoto})` } : undefined}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Cover Photo Upload Button on Bottom Right Corner */}
          {isOwnProfile && (
            <div className="absolute bottom-3 right-3 z-10">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                title="কভার ছবি আপডেট করুন"
                className="px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-xl text-xs font-bold backdrop-blur-md border border-white/30 shadow-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-105"
              >
                {isUploadingCover ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <Camera className="w-4 h-4 text-amber-300" />
                )}
                <span className="hidden sm:inline">কভার ছবি পরিবর্তন</span>
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'coverPhoto')}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Profile Avatar & Primary Info */}
        <div className="px-6 sm:px-10 pb-8 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            {/* Profile Avatar Container with Bottom-Right Camera Icon */}
            <div className="relative group self-start sm:self-auto">
              <img
                src={profileUser.profilePhoto}
                alt={profileUser.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
              />

              {/* Profile Photo Camera Upload Icon Button on Bottom Right Corner */}
              {isOwnProfile && (
                <div className="absolute bottom-1 right-1 z-10">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    title="প্রোফাইল ছবি আপডেট করুন"
                    className="p-2 sm:p-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xl border-2 border-white transition flex items-center justify-center cursor-pointer disabled:opacity-50 hover:scale-110 active:scale-95"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <Camera className="w-4 h-4 text-amber-300" />
                    )}
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profilePhoto')}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {isOwnProfile && (
                <button
                  id="edit-my-profile-btn"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-amber-300" />
                  <span>প্রোফাইল সম্পাদনা</span>
                </button>
              )}
            </div>
          </div>

          {/* Names & Taglines */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>{profileUser.name}</span>
                {profileUser.nickname && (
                  <span className="text-base sm:text-lg font-normal text-slate-500">({profileUser.nickname})</span>
                )}
              </h1>
              {profileUser.bloodGroup && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
                  <span>{profileUser.bloodGroup}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              {profileUser.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              {profileUser.batch && (
                <div className="flex items-center gap-1 font-bold text-blue-900">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                  <span>{profileUser.batch}</span>
                </div>
              )}
              {(profileUser.showEmailPhone || isOwnProfile) && profileUser.phone && (
                <div className="flex items-center gap-1 font-mono text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{profileUser.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio paragraph */}
          {profileUser.shortBio && (
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
              <p className="italic">"{profileUser.shortBio}"</p>
            </div>
          )}

          {/* Social Links */}
          {profileUser.socialLinks && Object.values(profileUser.socialLinks).some(Boolean) && (
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">যোগাযোগ ও সোশ্যাল:</span>
              {profileUser.socialLinks.facebook && (
                <a
                  href={profileUser.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition"
                  title="Facebook Profile"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {profileUser.socialLinks.linkedin && (
                <a
                  href={profileUser.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profileUser.socialLinks.whatsapp && (
                <a
                  href={`https://wa.me/${profileUser.socialLinks.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {profileUser.socialLinks.instagram && (
                <a
                  href={profileUser.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600 transition"
                  title="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profileUser.socialLinks.github && (
                <a
                  href={profileUser.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profileUser.socialLinks.website && (
                <a
                  href={profileUser.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-900 transition"
                  title="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Academic Details & Career/Location Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School & Batch Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-blue-900" />
            <span>মুকুল নিকেতন উচ্চ বিদ্যালয়ের শিক্ষাবর্ষ তথ্য</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">এসএসসি ব্যাচ</span>
              <span className="font-bold text-blue-950 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100">
                {profileUser.batch}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">এসএসসি পাসের বছর</span>
              <span className="font-semibold text-slate-800">{profileUser.sscYear || profileUser.batch.replace(/\D/g, '') || '২০২৬'}</span>
            </div>

            {profileUser.rollNumber && (
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">রোল নম্বর / স্টুডেন্ট আইডি</span>
                <span className="font-mono font-bold text-slate-800">{profileUser.rollNumber}</span>
              </div>
            )}

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">অধ্যয়নের সময়কাল</span>
              <span className="font-semibold text-slate-800">{profileUser.schoolYears || '২০১৬ – ২০২৬'}</span>
            </div>

            {profileUser.fatherName && (
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">পিতার নাম</span>
                <span className="font-semibold text-slate-800">{profileUser.fatherName}</span>
              </div>
            )}

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">সদস্য হওয়ার সন</span>
              <span className="font-medium text-slate-600">{profileUser.joinedDate || '২০২৬'}</span>
            </div>
          </div>
        </div>

        {/* Current Engagement & Privacy Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-blue-900" />
              <span>বর্তমান অবস্থান, পেশা ও যোগাযোগ</span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">বর্তমান পেশা / পদবি</div>
                <div className="font-semibold text-slate-800 mt-0.5">{profileUser.currentOccupation || 'শিক্ষার্থী'}</div>
              </div>

              {profileUser.organization && (
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">বর্তমান প্রতিষ্ঠান / কোম্পানি / কর্মস্থল</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{profileUser.organization}</div>
                </div>
              )}

              {profileUser.higherEducation && (
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">উচ্চশিক্ষা / বিশ্ববিদ্যালয়</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{profileUser.higherEducation}</div>
                </div>
              )}

              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">বর্তমান বাসস্থান</div>
                <div className="font-semibold text-slate-800 mt-0.5">{profileUser.location || 'ময়মনসিংহ, বাংলাদেশ'}</div>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>কমিউনিটি গোপনীয়তা নীতি</span>
            </div>
            <p>
              {profileUser.showEmailPhone
                ? 'এই সদস্য তার যোগাযোগের তথ্য সর্বসাধারণের জন্য উন্মুক্ত রেখেছেন।'
                : 'প্রাক্তনীদের তথ্যের নিরাপত্তা রক্ষার্থে ব্যক্তিগত ফোন নম্বর ও ইমেইল ঠিকানা সাধারণ ডিরেক্টরিতে সুরক্ষামূলকভাবে গোপন রাখা হয়।'}
            </p>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE FORM MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-950 to-blue-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-amber-300" />
                <h2 className="text-lg font-bold">প্রোফাইল তথ্য আপডেট</h2>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {saveMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{saveMessage}</span>
                </div>
              )}

              {/* SECTION 1: Name, Nickname & Bio */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-800">
                      সম্পূর্ণ নাম (Full Name)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="আপনার নাম লিখুন..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-800">
                      ডাকনাম (Nickname)
                    </label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                      placeholder="আপনার ডাকনাম (ঐচ্ছিক)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-800">
                    সংক্ষিপ্ত বায়ো (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.shortBio}
                    onChange={e => setFormData({ ...formData, shortBio: e.target.value })}
                    placeholder="আপনার কাজের ক্ষেত্র, লক্ষ্য ও নিজের সম্পর্কে সংক্ষেপে লিখুন..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                  />
                </div>
              </div>

              {/* SECTION 2: SSC Graduation Year, Batch & School Years */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-800">
                      এসএসসি পাসের বছর (Graduation Year)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sscYear}
                      onChange={e => setFormData({ 
                        ...formData, 
                        sscYear: e.target.value,
                        batch: `SSC ${e.target.value}`
                      })}
                      placeholder="2026"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-800">
                      এসএসসি ব্যাচের নাম (SSC Batch)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.batch}
                      onChange={e => setFormData({ ...formData, batch: e.target.value })}
                      placeholder="SSC 2026"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-800">
                    অধ্যয়নের সময়কাল (School Years)
                  </label>
                  <input
                    type="text"
                    value={formData.schoolYears}
                    onChange={e => setFormData({ ...formData, schoolYears: e.target.value })}
                    placeholder="উদাহরণ: ২০১৬ – ২০২৬ বা 1995 – 2005"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                  />
                </div>
              </div>

              {/* SECTION 3: Contact Information */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>যোগাযোগের তথ্য (Contact Information)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      মোবাইল নম্বর (Phone)
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017xxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      ইমেইল ঠিকানা (Email)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    বর্তমান বাসস্থান (Location)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="ময়মনসিংহ, বাংলাদেশ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                  />
                </div>
              </div>

              {/* SECTION 4: Career & Engagement */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>পেশা ও সামাজিক যোগাযোগ (Career & Socials)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      বর্তমান পেশা / পদবি
                    </label>
                    <input
                      type="text"
                      value={formData.currentOccupation}
                      onChange={e => setFormData({ ...formData, currentOccupation: e.target.value })}
                      placeholder="Software Engineer / Student"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      প্রতিষ্ঠান / কোম্পানি / ইউনিভার্সিটি
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Mukul Niketon High School / BUET / Co."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      হোয়াটসঅ্যাপ নম্বর (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+88017xxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      ফেসবুক প্রোফাইল লিংক (Facebook URL)
                    </label>
                    <input
                      type="url"
                      value={formData.facebook}
                      onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="https://facebook.com/yourprofile"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Privacy Settings */}
              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={formData.showEmailPhone}
                    onChange={e => setFormData({ ...formData, showEmailPhone: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">সাজানো ডিরেক্টরিতে ইমেইল ও ফোন নম্বর প্রদর্শন করুন</span>
                    <span className="text-slate-500">অন্যান্য প্রাক্তনী শিক্ষার্থীরা যাতে আপনার সাথে সরাসরি যোগাযোগ করতে পারে।</span>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isJustSaved}
                  className={`px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer ${
                    isJustSaved 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-blue-900 hover:bg-blue-800 disabled:opacity-50'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>সেভ হচ্ছে...</span>
                    </>
                  ) : isJustSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>সেভ হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>সেভ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
