import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Briefcase, 
  BookOpen, 
  Shield, 
  Edit3, 
  Globe, 
  Facebook, 
  Linkedin, 
  Github, 
  Instagram,
  Clock,
  Heart,
  UserCheck,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { selectedProfileId, users, currentUser, setActiveTab } = useApp();

  // Find user by selectedProfileId, or default to first student, or currentUser
  const profileUser = users.find(u => u.id === selectedProfileId) || 
                      users.find(u => u.role === 'student' && u.status === 'approved') || 
                      currentUser;

  if (!profileUser) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">প্রোফাইল পাওয়া যায়নি</h2>
        <p className="text-slate-500 text-sm">আপনি যে শিক্ষার্থীর প্রোফাইল খুঁজছেন তা খুঁজে পাওয়া যায়নি বা বিদ্যমান নেই।</p>
        <button
          onClick={() => setActiveTab('students')}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold"
        >
          প্রাক্তন শিক্ষার্থী তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div id="individual-profile-page" className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Navigation breadcrumb */}
      <button
        id="back-to-directory-btn"
        onClick={() => setActiveTab('students')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>প্রাক্তন শিক্ষার্থী তালিকায় ফিরে যান</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Cover Photo Banner */}
        <div 
          className="h-44 sm:h-56 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 relative bg-cover bg-center"
          style={profileUser.coverPhoto ? { backgroundImage: `url(${profileUser.coverPhoto})` } : undefined}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Profile Avatar & Primary Info */}
        <div className="px-6 sm:px-10 pb-8 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <div className="relative">
              <img
                src={profileUser.profilePhoto}
                alt={profileUser.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {isOwnProfile && (
                <button
                  id="edit-my-profile-btn"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-xs transition flex items-center gap-2"
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {profileUser.name}
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
              <span className="text-slate-500 font-medium">এসএসসি বছর</span>
              <span className="font-semibold text-slate-800">{profileUser.sscYear || profileUser.batch.replace(/\D/g, '') || '২০২৬'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">শ্রেণি ও শাখা</span>
              <span className="font-semibold text-slate-800">{profileUser.classSection || 'N/A'}</span>
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
              <span>বর্তমান অবস্থান, পেশা ও উচ্চশিক্ষা</span>
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

          {/* Privacy Note as mandated in blueprint */}
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
    </div>
  );
};
