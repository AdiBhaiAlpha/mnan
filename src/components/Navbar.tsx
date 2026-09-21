import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  LayoutDashboard, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Menu, 
  X,
  School,
  BookOpen,
  Info
} from 'lucide-react';
import { ActiveTab, isAdminName } from '../types';

export const Navbar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, logout, users, isAdminAuthenticated, viewProfile } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeUser = currentUser ? (users.find(u => u.id === currentUser.id || u.email === currentUser.email) || currentUser) : null;
  const pendingCount = users.filter(u => u.status === 'pending').length;
  const isCurrentAdmin = activeUser?.role === 'admin' || (activeUser ? isAdminName(activeUser.name) : false);

  const navItems: { id: ActiveTab; label: string; subLabel?: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'মূলপাতা', subLabel: 'হোম', icon: School },
    { id: 'about', label: 'বিদ্যালয় পরিচিতি', subLabel: 'ইতিহাস ও ঐতিহ্য', icon: BookOpen },
    { id: 'students', label: 'প্রাক্তন শিক্ষার্থী ডিরেক্টরি', subLabel: 'অ্যালামনাই তালিকা', icon: Users },
    { id: 'community', label: 'আলাপ', subLabel: 'কমিউনিটি ফোরাম', icon: MessageSquare },
  ];

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Identity */}
          <div 
            id="brand-logo-container"
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3.5 cursor-pointer select-none group"
          >
            {/* Crest badge */}
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs overflow-hidden group-hover:border-amber-400 transition-colors shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/bn/thumb/f/fb/%E0%A6%AE%E0%A7%81%E0%A6%95%E0%A7%81%E0%A6%B2_%E0%A6%A8%E0%A6%BF%E0%A6%95%E0%A7%87%E0%A6%A4%E0%A6%A8_%E0%A6%89%E0%A6%9A%E0%A7%8D%E0%A6%9A_%E0%A6%AC%E0%A6%BF%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A6%AF%E0%A6%BC%2C_%E0%A6%AE%E0%A6%AF%E0%A6%BC%E0%A6%AE%E0%A6%A8%E0%A6%B8%E0%A6%BF%E0%A6%82%E0%A6%B9_%E0%A6%8F%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png/250px-%E0%A6%AE%E0%A7%81%E0%A6%95%E0%A7%81%E0%A6%B2_%E0%A6%A8%E0%A6%BF%E0%A6%95%E0%A7%87%E0%A6%A4%E0%A6%A8_%E0%A6%89%E0%A6%9A%E0%A7%8D%E0%A6%9A_%E0%A6%AC%E0%A6%BF%E0%A6%A6%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A6%AF%E0%A6%BC%2C_%E0%A6%AE%E0%A6%AF%E0%A6%BC%E0%A6%AE%E0%A6%A8%E0%A6%B8%E0%A6%BF%E0%A6%82%E0%A6%B9_%E0%A6%8F%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.png"
                alt="মুকুল নিকেতন উচ্চ বিদ্যালয় লোগো"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                <span>মুকুল নিকেতন প্রাক্তন শিক্ষার্থী নেটওয়ার্ক</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 tracking-wide">
                Mukul Niketan Alumni Network
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span style={item.id === 'community' ? { fontFamily: 'system-ui' } : undefined}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium screen Navigation dropdown/compact */}
          <div className="hidden lg:flex xl:hidden items-center gap-1">
            {navItems.slice(0, 4).map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span style={item.id === 'community' ? { fontFamily: 'system-ui' } : undefined}>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Section: User Session & Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {activeUser ? (
              <div className="flex items-center gap-2">
                <div 
                  id="nav-user-profile-chip"
                  onClick={() => {
                    if (activeUser) {
                      viewProfile(activeUser.id);
                    }
                  }}
                  className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-none cursor-pointer transition select-none group"
                  title="আমার প্রোফাইল দেখুন"
                >
                  <img
                    src={activeUser.profilePhoto}
                    alt={activeUser.name}
                    className="w-7 h-7 rounded-none object-cover border border-slate-200 group-hover:border-amber-400 transition-colors"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5 group-hover:text-amber-800 transition-colors">
                      <span className="truncate max-w-[140px]">{activeUser.name}</span>
                    </div>
                  </div>
                </div>

                {isCurrentAdmin && (
                  <button
                    id="nav-admin-panel-btn"
                    onClick={() => handleNav('admin')}
                    title="এডমিন ড্যাশবোর্ড ও নিয়ন্ত্রণ"
                    className={`px-3 py-1.5 text-xs font-bold rounded-none transition flex items-center gap-1.5 border ${
                      activeTab === 'admin'
                        ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>এডমিন প্যানেল</span>
                  </button>
                )}

                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  title="লগআউট"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-none transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-none transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>লগইন</span>
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-none shadow-xs transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                  <span>নিবন্ধন করুন</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {activeUser && (
            <div className="p-3 bg-slate-50 rounded-none mb-3 flex items-center justify-between border border-slate-200">
              <div 
                onClick={() => {
                  viewProfile(activeUser.id);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition"
                title="আমার প্রোফাইল দেখুন"
              >
                <img
                  src={activeUser.profilePhoto}
                  alt={activeUser.name}
                  className="w-10 h-10 rounded-none object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{activeUser.name}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {isCurrentAdmin ? 'প্রশাসক' : activeUser.batch}
                  </div>
                </div>
              </div>
              {isCurrentAdmin ? (
                <button
                  onClick={() => handleNav('admin')}
                  className="text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-none shadow-xs"
                >
                  এডমিন প্যানেল
                </button>
              ) : (
                <button
                  onClick={() => handleNav('dashboard')}
                  className="text-xs font-bold text-slate-900 bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-none"
                >
                  ড্যাশবোর্ড
                </button>
              )}
            </div>
          )}

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span style={item.id === 'community' ? { fontFamily: 'system-ui' } : undefined}>{item.label}</span>
                </div>
                {item.subLabel && (
                  <span className={`text-[11px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {item.subLabel}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>আমার প্রোফাইল ও ড্যাশবোর্ড</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2 text-center text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
                >
                  লগইন
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2 text-center text-xs font-bold text-white bg-blue-900 rounded-lg"
                >
                  নিবন্ধন করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
