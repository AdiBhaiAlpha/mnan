import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImageUploaderBox } from './ImageUploaderBox';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  Edit2, 
  MessageSquare, 
  Calendar, 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  UserX,
  Phone,
  Mail,
  Lock,
  Key,
  LogOut,
  ExternalLink,
  Sparkles,
  Send,
  Check,
  RefreshCw,
  EyeOff,
  Building2,
  Tag,
  Database,
  FileJson,
  Server,
  Code
} from 'lucide-react';
import { User, Product, ReunionEvent, UserStatus, isAdminName } from '../types';

export const AdminView: React.FC = () => {
  const { 
    users, 
    posts, 
    events, 
    products, 
    orderInquiries, 
    currentUser, 
    isAdminAuthenticated,
    adminUsername,
    adminLogin,
    adminChangeCredentials,
    adminLogout,
    approveUser, 
    rejectUser, 
    suspendUser, 
    activateUser, 
    deleteUser, 
    editUserByAdmin,
    createStudentByAdmin,
    deletePost, 
    deleteComment,
    createOfficialPost,
    createEvent, 
    editEvent,
    deleteEvent, 
    addProduct, 
    editProduct,
    deleteProduct, 
    updateOrderStatus,
    viewProfile,
    setActiveTab,
    resetAllData,
    isDbLoaded,
    dbSyncStatus,
    refreshFromDatabase
  } = useApp();

  // Operator Tabs: Dashboard | User Management | Post Management | Event Management | Database
  const [operatorTab, setOperatorTab] = useState<'dashboard' | 'users' | 'posts' | 'events' | 'database'>('dashboard');
  const [selectedJsonFile, setSelectedJsonFile] = useState<'users' | 'posts' | 'events' | 'products' | 'orders'>('users');
  const [copySuccess, setCopySuccess] = useState(false);

  // Login form state (if not authenticated)
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Change Credentials Modal / Section state
  const [showCredModal, setShowCredModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newUsername, setNewUsername] = useState(adminUsername);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [credLoading, setCredLoading] = useState(false);
  const [credMsg, setCredMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState<string>('all');
  const [userFilterBatch, setUserFilterBatch] = useState<string>('all');

  // Add Student Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNickname, setNewStudentNickname] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentBatch, setNewStudentBatch] = useState('SSC 2026');
  const [newStudentSection, setNewStudentSection] = useState('');
  const [newStudentOccupation, setNewStudentOccupation] = useState('');
  const [newStudentBio, setNewStudentBio] = useState('');
  const [newStudentLocation, setNewStudentLocation] = useState('Mymensingh, Bangladesh');
  const [newStudentStatus, setNewStudentStatus] = useState<UserStatus>('approved');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New Event Form Modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ReunionEvent | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('Mukul Niketon High School Campus, Mymensingh');
  const [eventDesc, setEventDesc] = useState('');
  const [eventBanner, setEventBanner] = useState('https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80');

  // New Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(500);
  const [prodCategory, setProdCategory] = useState('Apparel');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80');
  const [prodSizes, setProdSizes] = useState('S, M, L, XL');

  // Quick Official Post composer on Dashboard
  const [officialPostContent, setOfficialPostContent] = useState('');
  const [officialPostImg, setOfficialPostImg] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  // Post search & moderation state
  const [postSearch, setPostSearch] = useState('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);

  // ---------------- AUTHENTICATION GUARD ----------------
  const isSpecialAdmin = currentUser?.role === 'admin' || (currentUser ? isAdminName(currentUser.name) : false);
  const effectiveAdminAuthenticated = isAdminAuthenticated || isSpecialAdmin;

  // If not logged in as Admin, show the Operator Login UI
  if (!effectiveAdminAuthenticated) {
    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      setLoginLoading(true);

      const res = await adminLogin(loginUsername.trim(), loginPassword);
      setLoginLoading(false);

      if (!res.success) {
        setLoginError(res.message);
      }
    };

    return (
      <div id="admin-login-screen" className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-8 text-center relative">
            <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md font-bold">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
              প্রশাসনিক পোর্টাল
            </span>
            <h1 className="text-xl font-black tracking-tight text-white">মুকুল নিকেতন উচ্চ বিদ্যালয়</h1>
            <p className="text-xs text-slate-400 mt-1">
              অপারেটর কন্ট্রোল সেন্টার • ময়মনসিংহ
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">অপারেটর সাইন ইন</h2>
              <p className="text-xs text-slate-500 mt-1">
                শিক্ষার্থী যাচাইকরণ, অনুমোদন ও পোস্ট পরিচালনার জন্য প্রশাসনিক তথ্য দিয়ে লগইন করুন।
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  অপারেটর ইউজারনেম
                </label>
                <div className="relative">
                  <input
                    id="admin-username-input"
                    type="text"
                    required
                    value={loginUsername}
                    onChange={e => setLoginUsername(e.target.value)}
                    placeholder="যেমন: admin"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  অপারেটর পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="admin-login-submit-btn"
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>যাচাই করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>অ্যাডমিন প্যানেলে প্রবেশ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="p-4 bg-amber-50 border border-amber-200/70 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                <Key className="w-3.5 h-3.5 text-amber-700" />
                <span>ডিফল্ট লগইন তথ্য</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                প্রাথমিক ইউজারনেম <span className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">admin</span> এবং পাসওয়ার্ড <span className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">admin</span>। আপনি ড্যাশবোর্ড থেকে যে কোনো সময় এই তথ্য পরিবর্তন করতে পারবেন।
              </p>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                ← মূল পোর্টালে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- METRICS & STATS ----------------
  const approvedStudents = users.filter(u => u.status === 'approved' && u.role === 'student');
  const pendingAccounts = users.filter(u => u.status === 'pending');
  const suspendedAccounts = users.filter(u => u.status === 'suspended');
  const totalPostsCount = posts.length;
  const totalCommentsCount = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
  const upcomingEvents = events.filter(e => e.status === 'upcoming');

  // Filtered Users for User Management
  const filteredUsers = users.filter(u => {
    if (u.role === 'admin') return false; // keep admin hidden from normal student list
    const matchSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.batch.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch)) ||
      (u.classSection && u.classSection.toLowerCase().includes(userSearch.toLowerCase()));
    
    const matchStatus = userFilterStatus === 'all' || u.status === userFilterStatus;
    const matchBatch = userFilterBatch === 'all' || u.batch === userFilterBatch;
    return matchSearch && matchStatus && matchBatch;
  });

  // Unique batches for filter
  const allBatches = Array.from(new Set(users.map(u => u.batch))).filter(Boolean).sort();

  // Filtered Posts for Post Management
  const filteredPosts = posts.filter(p => {
    return (
      p.authorName.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.content.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.authorBatch.toLowerCase().includes(postSearch.toLowerCase())
    );
  });

  // Handle Credentials Change
  const handleChangeCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredMsg(null);

    if (newPass !== confirmPass) {
      setCredMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPass.length < 4) {
      setCredMsg({ type: 'error', text: 'Password must be at least 4 characters long.' });
      return;
    }

    setCredLoading(true);
    const res = await adminChangeCredentials(currentPass, newUsername.trim(), newPass);
    setCredLoading(false);

    if (res.success) {
      setCredMsg({ type: 'success', text: res.message });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setCredMsg({ type: 'error', text: res.message });
    }
  };

  // Handle Create Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    createEvent({
      title: eventTitle.trim(),
      date: eventDate.trim() || 'TBD',
      time: eventTime.trim() || 'TBD',
      venue: eventVenue.trim(),
      description: eventDesc.trim(),
      bannerUrl: eventBanner.trim(),
      status: 'upcoming'
    });
    setShowEventModal(false);
    setEventTitle('');
    setEventDesc('');
  };

  // Handle Add Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    addProduct({
      name: prodName.trim(),
      price: Number(prodPrice) || 500,
      category: prodCategory.trim(),
      description: prodDesc.trim(),
      imageUrl: prodImg.trim(),
      availableSizes: prodSizes ? prodSizes.split(',').map(s => s.trim()) : undefined,
      inStock: true
    });
    setShowProductModal(false);
    setProdName('');
    setProdDesc('');
  };

  // Handle Quick Official Notice
  const handleBroadcastOfficialPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialPostContent.trim()) return;

    createOfficialPost(officialPostContent.trim(), officialPostImg.trim() || undefined);
    setOfficialPostContent('');
    setOfficialPostImg('');
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 4000);
  };

  // Handle Add Student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    createStudentByAdmin({
      name: newStudentName.trim(),
      nickname: newStudentNickname.trim() || undefined,
      email: newStudentEmail.trim().toLowerCase(),
      phone: newStudentPhone.trim(),
      batch: newStudentBatch.trim(),
      classSection: newStudentSection.trim(),
      currentOccupation: newStudentOccupation.trim(),
      shortBio: newStudentBio.trim(),
      location: newStudentLocation.trim(),
      status: newStudentStatus
    });

    setShowAddStudentModal(false);
    setNewStudentName('');
    setNewStudentNickname('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentOccupation('');
    setNewStudentBio('');
  };

  // Handle Edit User
  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    editUserByAdmin(editingUser.id, editingUser);
    setEditingUser(null);
  };

  return (
    <div id="admin-operator-panel" className="space-y-8 pb-20">
      {/* ================= TOP OPERATOR HEADER ================= */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center font-black shadow-md shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Mukul Niketon High School Operator Console
              </h1>
              <p className="text-xs text-slate-400">
                Authorized Central Management • Verification, Alumni Directory, Feed Moderation & Settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="admin-change-credentials-btn"
              onClick={() => setShowCredModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Credentials</span>
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>View Public Portal</span>
            </button>
            <button
              id="admin-logout-btn"
              onClick={adminLogout}
              className="px-3.5 py-2 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Primary Operator Tabs: Dashboard | User Management | Post Management */}
        <div className="pt-6 flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-admin-dashboard"
            onClick={() => setOperatorTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              operatorTab === 'dashboard'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Dashboard</span>
            {pendingAccounts.length > 0 && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-bold">
                {pendingAccounts.length}
              </span>
            )}
          </button>

          <button
            id="tab-admin-users"
            onClick={() => setOperatorTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              operatorTab === 'users'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded-full text-[10px] font-bold">
              {users.filter(u => u.role !== 'admin').length}
            </span>
          </button>

          <button
            id="tab-admin-posts"
            onClick={() => setOperatorTab('posts')}
            className={`px-4 py-2.5 rounded-none text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              operatorTab === 'posts'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Post Management</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded-none text-[10px] font-bold">
              {posts.length}
            </span>
          </button>

          <button
            id="tab-admin-events"
            onClick={() => setOperatorTab('events')}
            className={`px-4 py-2.5 rounded-none text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              operatorTab === 'events'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Event Management</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded-none text-[10px] font-bold">
              {events.length}
            </span>
          </button>

          <button
            id="tab-admin-database"
            onClick={() => setOperatorTab('database')}
            className={`px-4 py-2.5 rounded-none text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              operatorTab === 'database'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>JSON Database</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] text-slate-300 uppercase font-mono">live</span>
            </span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: DASHBOARD ================= */}
      {operatorTab === 'dashboard' && (
        <div id="admin-dashboard-view" className="space-y-8">
          {/* THE 5 REQUIRED DASHBOARD OPERATOR STAT CARDS:
              1. Approved Students
              2. Pending Accounts
              3. Total Posts
              4. Events
              5. Products
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Approved Students */}
            <div 
              id="card-approved-students"
              onClick={() => {
                setUserFilterStatus('approved');
                setOperatorTab('users');
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Verified
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Students</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {approvedStudents.length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2 group-hover:text-emerald-700 font-semibold flex items-center justify-between">
                <span>Manage directory</span>
                <span>→</span>
              </p>
            </div>

            {/* 2. Pending Accounts */}
            <div 
              id="card-pending-accounts"
              onClick={() => {
                setUserFilterStatus('pending');
                setOperatorTab('users');
              }}
              className={`p-5 rounded-2xl border shadow-xs transition cursor-pointer group ${
                pendingAccounts.length > 0 
                  ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-50 hover:shadow-md' 
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                {pendingAccounts.length > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-600 text-white rounded-full animate-pulse">
                    Action Req.
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                    Cleared
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Accounts</p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
                {pendingAccounts.length}
              </h3>
              <p className="text-[11px] text-amber-800 font-semibold mt-2 flex items-center justify-between">
                <span>Review applications</span>
                <span>→</span>
              </p>
            </div>

            {/* 3. Total Posts */}
            <div 
              id="card-total-posts"
              onClick={() => setOperatorTab('posts')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  +{totalCommentsCount} comm.
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Posts</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {totalPostsCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2 group-hover:text-blue-700 font-semibold flex items-center justify-between">
                <span>Moderate feed</span>
                <span>→</span>
              </p>
            </div>

            {/* 4. Events */}
            <div 
              id="card-events"
              onClick={() => setOperatorTab('events')}
              className="bg-white p-5 rounded-none border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-none flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-none">
                  {upcomingEvents.length} upcoming
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Events</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {events.length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2 group-hover:text-purple-700 font-semibold flex items-center justify-between">
                <span>Manage & Delete</span>
                <span>→</span>
              </p>
            </div>
          </div>

          {/* Quick Pending Queue Review Section (if any accounts pending) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Pending Student Verification Queue</span>
                  {pendingAccounts.length > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      {pendingAccounts.length} waiting
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify graduating students and alumni before approving their profile into the public directory.
                </p>
              </div>

              {pendingAccounts.length > 0 && (
                <button
                  onClick={() => {
                    setUserFilterStatus('pending');
                    setOperatorTab('users');
                  }}
                  className="text-xs text-amber-800 hover:text-amber-950 font-bold"
                >
                  View All in User Management →
                </button>
              )}
            </div>

            <div className="pt-4">
              {pendingAccounts.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">All pending accounts have been reviewed!</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    No student registrations are currently awaiting operator approval.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingAccounts.slice(0, 4).map(student => (
                    <div 
                      key={student.id}
                      className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img 
                          src={student.profilePhoto} 
                          alt={student.name}
                          className="w-12 h-12 rounded-xl object-cover border border-amber-200 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{student.name}</h4>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded-md">
                              {student.batch}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate mt-0.5">{student.classSection || 'Student'}</p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{student.email}</p>
                          {student.phone && (
                            <p className="text-[10px] font-mono text-slate-500 mt-0.5">📞 {student.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                        <button
                          onClick={() => approveUser(student.id)}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Student</span>
                        </button>
                        <button
                          onClick={() => rejectUser(student.id)}
                          className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => viewProfile(student.id)}
                          className="px-2 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Local JSON Database Engine Banner */}
          <div className="bg-slate-900 text-white p-5 rounded-none border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-none flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white font-mono">
                    Local JSON File Database Engine Active
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    /data/*.json
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ব্যবহারকারী, পোস্ট, ইভেন্ট, পণ্য ও অর্ডার সরাসরি লোকাল JSON ফাইলে রিয়েল-টাইমে সংরক্ষিত হচ্ছে।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOperatorTab('database')}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition rounded-none flex items-center gap-1.5"
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>JSON ফাইলগুলো দেখুন</span>
              </button>
            </div>
          </div>

          {/* Quick Notice Broadcast & Credential Settings Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Official Announcement Dispatcher */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Publish Official School Notice</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Broadcast priority institutional announcements directly to the Mukul Niketon community feed.
                </p>

                {postSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official announcement published successfully to the community feed!</span>
                  </div>
                )}

                <form onSubmit={handleBroadcastOfficialPost} className="space-y-3">
                  <div>
                    <textarea
                      rows={3}
                      required
                      value={officialPostContent}
                      onChange={e => setOfficialPostContent(e.target.value)}
                      placeholder="Write official message, reunion instruction, or school circular..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <ImageUploaderBox
                      label="Notice Image / Banner (Optional)"
                      value={officialPostImg}
                      onChange={url => setOfficialPostImg(url)}
                      aspect="banner"
                      placeholder="Select image for official circular"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Broadcast Official Notice</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Operator Security & Credentials Module (can change password from dashboard) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Admin Credentials & Security</span>
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  Server-Hashed
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Update the administrator operator username and password. Passwords are never exposed or saved in client-side code.
              </p>

              {credMsg && (
                <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                  credMsg.type === 'success' 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {credMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{credMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangeCredentialsSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    placeholder="Enter current password (default: admin)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      New Username
                    </label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="At least 4 characters"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={credLoading}
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {credLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Server Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" />
                      <span>Update Admin Credentials</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: USER MANAGEMENT ================= */}
      {operatorTab === 'users' && (
        <div id="admin-user-management-view" className="space-y-6">
          {/* Controls Bar: Search, Status Filters, Add Student Button */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  <span>Student & Alumni Directory Management</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  View, verify, suspend, or update records for all registered Mukul Niketon High School students.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="admin-add-student-btn"
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add New Student</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-user-search-input"
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search students by name, batch, phone, or email..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setUserFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    userFilterStatus === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({users.filter(u => u.role !== 'admin').length})
                </button>
                <button
                  onClick={() => setUserFilterStatus('approved')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    userFilterStatus === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/50'
                  }`}
                >
                  Approved ({approvedStudents.length})
                </button>
                <button
                  onClick={() => setUserFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                    userFilterStatus === 'pending'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <span>Pending</span>
                  {pendingAccounts.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px]">
                      {pendingAccounts.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setUserFilterStatus('suspended')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    userFilterStatus === 'suspended'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/50'
                  }`}
                >
                  Suspended ({suspendedAccounts.length})
                </button>
              </div>

              {/* Batch Filter Select */}
              <div className="sm:w-40">
                <select
                  value={userFilterBatch}
                  onChange={e => setUserFilterBatch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">All Batches</option>
                  {allBatches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Students Table / Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">No student accounts matched your criteria</p>
                <p className="text-[11px] text-slate-400">Try changing the search query or status filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Student Profile</th>
                      <th className="py-3.5 px-4">Batch & Schooling</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Current Occupation</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Operator Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredUsers.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition">
                        {/* Student Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.profilePhoto}
                              alt={student.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{student.name}</p>
                              {student.nickname && (
                                <p className="text-[10px] text-slate-500">“{student.nickname}”</p>
                              )}
                              <p className="text-[10px] text-slate-400">Joined: {student.joinedDate}</p>
                            </div>
                          </div>
                        </td>

                        {/* Batch & Section */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-[11px]">
                            {student.batch}
                          </span>
                          <p className="text-[11px] text-slate-600 mt-1">{student.classSection || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400">{student.schoolYears}</p>
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-4">
                          <p className="text-slate-800 font-medium">{student.email}</p>
                          {student.phone ? (
                            <p className="text-[11px] font-mono text-slate-500 mt-0.5">{student.phone}</p>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">No phone</p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-0.5">{student.location || 'Mymensingh'}</p>
                        </td>

                        {/* Occupation */}
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-800 line-clamp-1">{student.currentOccupation || 'Student'}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{student.shortBio}</p>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4">
                          {student.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          )}
                          {student.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pending Approval
                            </span>
                          )}
                          {student.status === 'suspended' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-[10px] font-bold">
                              <UserX className="w-3 h-3 text-red-600" />
                              Suspended
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {student.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveUser(student.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                  title="Approve student"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => rejectUser(student.id)}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                  title="Reject application"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {student.status === 'approved' && (
                              <button
                                onClick={() => suspendUser(student.id)}
                                className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-lg text-xs font-semibold transition"
                                title="Suspend account"
                              >
                                Suspend
                              </button>
                            )}

                            {student.status === 'suspended' && (
                              <button
                                onClick={() => activateUser(student.id)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition"
                                title="Reactivate account"
                              >
                                Reactivate
                              </button>
                            )}

                            <button
                              onClick={() => setEditingUser(student)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="Edit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => viewProfile(student.id)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="View Public Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to permanently delete student ${student.name}?`)) {
                                  deleteUser(student.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: POST MANAGEMENT ================= */}
      {operatorTab === 'posts' && (
        <div id="admin-post-management-view" className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span>Community Feed & Post Moderation</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Oversee all community updates, remove spam or inappropriate messages, and moderate discussions.
                </p>
              </div>

              <button
                onClick={() => {
                  setOfficialPostContent('Official Notice from Administration: ');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Official School Post</span>
              </button>
            </div>

            {/* Post Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-post-search-input"
                type="text"
                value={postSearch}
                onChange={e => setPostSearch(e.target.value)}
                placeholder="Filter posts by author name, batch, or keywords..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-800">No community posts match your search</p>
                <p className="text-[11px] text-slate-400">Clear your keyword filter to view all feed posts.</p>
              </div>
            ) : (
              filteredPosts.map(post => {
                const authorUser = users.find(u => u.id === post.authorId || u.name === post.authorName);
                const authorName = authorUser?.name || post.authorName;
                const authorAvatar = authorUser?.profilePhoto || post.authorAvatar;
                const authorBatch = authorUser?.batch || post.authorBatch;
                const isOfficial = authorName.includes('Admin') || authorBatch.includes('Administration');
                const isCommentsOpen = expandedCommentsPostId === post.id;

                return (
                  <div 
                    key={post.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition ${
                      isOfficial ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Author Header */}
                      <div className="flex items-center gap-3">
                        <img
                          src={authorAvatar}
                          alt={authorName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{authorName}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                              {authorBatch}
                            </span>
                            {isOfficial && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-400 text-slate-950 rounded-full">
                                Official Notice
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{post.createdAt}</p>
                        </div>
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this community post permanently?')) {
                              deletePost(post.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>Delete Post</span>
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mt-3 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </div>

                    {post.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={post.imageUrl}
                          alt="Post attachment"
                          className="max-h-60 rounded-xl object-cover border border-slate-200"
                        />
                      </div>
                    )}

                    {/* Engagement & Comment Moderation Controls */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>❤️ {post.likes.length} Likes</span>
                        <span>💬 {post.comments.length} Comments</span>
                      </div>

                      {post.comments.length > 0 && (
                        <button
                          onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                          className="text-slate-700 hover:text-slate-950 font-bold"
                        >
                          {isCommentsOpen ? 'Hide Comments' : `Moderate Comments (${post.comments.length})`}
                        </button>
                      )}
                    </div>

                    {/* Expanded Comments List */}
                    {isCommentsOpen && post.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 bg-slate-50 p-3 rounded-xl">
                        <p className="text-[11px] font-bold text-slate-700 mb-1">Attached Comments:</p>
                        {post.comments.map(c => {
                          const commentAuthor = users.find(u => u.id === c.authorId || u.name === c.authorName);
                          const commentName = commentAuthor?.name || c.authorName;
                          const commentAvatar = commentAuthor?.profilePhoto || c.authorAvatar;
                          const commentBatch = commentAuthor?.batch || c.authorBatch;

                          return (
                            <div key={c.id} className="flex items-start justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200 text-xs">
                              <div className="flex items-start gap-2">
                                <img src={commentAvatar} alt={commentName} className="w-6 h-6 rounded-md object-cover mt-0.5" />
                                <div>
                                  <span className="font-bold text-slate-900">{commentName}</span>
                                  <span className="text-[10px] text-slate-400 ml-1.5">({commentBatch})</span>
                                  <p className="text-slate-700 mt-0.5">{c.content}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => deleteComment(post.id, c.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: EVENT MANAGEMENT ================= */}
      {operatorTab === 'events' && (
        <div id="admin-events-view" className="space-y-6">
          <div className="bg-white p-6 rounded-none border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-900" />
                <span>অনুষ্ঠান ব্যবস্থাপনা ও নিয়ন্ত্রণ (Event Management)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                সকল রিইউনিয়ন ও কমিউনিটি ঘোষিত অনুষ্ঠান পরিচালনা করুন। যেকোনো অনুষ্ঠান মুছে ফেলা বা পর্যবেক্ষণ করা যাবে।
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-none text-xs font-bold">
                মোট অনুষ্ঠান: {events.length} টি
              </span>
              <button
                id="admin-create-event-shortcut-btn"
                onClick={() => setActiveTab('community')}
                className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-none text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>নতুন অনুষ্ঠান তৈরি</span>
              </button>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-none border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700">কোনো অনুষ্ঠান পাওয়া যায়নি</h4>
              <p className="text-xs text-slate-400 mt-1">কমিউনিটি আলাপ পাতা থেকে নতুন অনুষ্ঠান পোস্ট করা হলে এখানে প্রদর্শিত হবে।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(event => {
                const liveAttendeeCount = event.rsvps ? event.rsvps.length : 0;

                return (
                  <div
                    key={event.id}
                    id={`admin-event-card-${event.id}`}
                    className="bg-white rounded-none border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none uppercase ${
                              event.status === 'upcoming' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {event.status === 'upcoming' ? 'আসন্ন' : 'সম্পন্ন'}
                            </span>
                            {(event.title.includes('রিইউনিয়ন') || event.title.includes('Reunion')) && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-amber-100 text-amber-900">
                                প্রধান রিইউনিয়ন
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-extrabold text-slate-900">{event.title}</h4>
                        </div>

                        <button
                          id={`admin-delete-event-${event.id}`}
                          onClick={() => {
                            setEventToDelete(event);
                          }}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-none border border-red-200 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                          title="অনুষ্ঠান ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>ডিলিট</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>লাইভ বুকিং সংখ্যা: {liveAttendeeCount} জন</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium truncate max-w-[220px]">
                        ভেন্যু: {event.venue}
                      </span>
                      <button
                        onClick={() => setActiveTab('home')}
                        className="text-blue-900 hover:text-blue-700 font-bold transition flex items-center gap-1"
                      >
                        <span>হোমে দেখুন →</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: LOCAL JSON DATABASE ================= */}
      {operatorTab === 'database' && (
        <div id="admin-database-view" className="space-y-6">
          {/* Top Control Card */}
          <div className="bg-white p-6 rounded-none border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">
                  লোকাল JSON ফাইল ডাটাবেস ইঞ্জিন (Local JSON Database)
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-none bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active & Synced</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                অ্যাপের সকল তথ্য (ব্যবহারকারী, পোস্ট, ইভেন্ট, মার্চেন্ডাইজ ও অর্ডার) সার্ভারের <code className="px-1 py-0.5 bg-slate-100 text-slate-800 font-mono text-[11px]">/data/*.json</code> ফাইলগুলোতে স্বয়ংক্রিয়ভাবে সংরক্ষিত ও পরিচালিত হচ্ছে।
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-refresh-db"
                onClick={async () => {
                  await refreshFromDatabase();
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-none text-xs font-bold transition flex items-center gap-1.5 border border-slate-300"
                title="সার্ভার JSON ফাইল থেকে সর্বশেষ ডাটা রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${dbSyncStatus === 'syncing' ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
                <span>রিফ্রেশ / সিঙ্ক</span>
              </button>

              <button
                id="btn-force-sync-db"
                onClick={async () => {
                  try {
                    await fetch('/api/db/sync/batch', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        users,
                        posts,
                        events,
                        products,
                        orders: orderInquiries
                      })
                    });
                    alert('সবগুলো লোকাল JSON ফাইলে বর্তমান ডাটা সফলভাবে সংরক্ষণ করা হয়েছে!');
                  } catch (e) {
                    alert('সিঙ্ক করতে সমস্যা হয়েছে');
                  }
                }}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-none text-xs font-bold transition flex items-center gap-1.5"
              >
                <Server className="w-3.5 h-3.5" />
                <span>সব ফাইল সেভ করুন</span>
              </button>
            </div>
          </div>

          {/* Database File Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. users.json */}
            <div 
              onClick={() => setSelectedJsonFile('users')}
              className={`p-4 rounded-none border transition cursor-pointer ${
                selectedJsonFile === 'users' 
                  ? 'bg-blue-50/70 border-blue-500 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileJson className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-100 text-blue-800 font-bold">
                  {users.length} records
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-mono">data/users.json</h4>
              <p className="text-[11px] text-slate-500 mt-1">প্রাক্তন শিক্ষার্থী ও অ্যাডমিন অ্যাকাউন্ট</p>
            </div>

            {/* 2. posts.json */}
            <div 
              onClick={() => setSelectedJsonFile('posts')}
              className={`p-4 rounded-none border transition cursor-pointer ${
                selectedJsonFile === 'posts' 
                  ? 'bg-purple-50/70 border-purple-500 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileJson className="w-4 h-4 text-purple-600" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-purple-100 text-purple-800 font-bold">
                  {posts.length} records
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-mono">data/posts.json</h4>
              <p className="text-[11px] text-slate-500 mt-1">আলাপ পোস্ট, লাইক ও মন্তব্য</p>
            </div>

            {/* 3. events.json */}
            <div 
              onClick={() => setSelectedJsonFile('events')}
              className={`p-4 rounded-none border transition cursor-pointer ${
                selectedJsonFile === 'events' 
                  ? 'bg-amber-50/70 border-amber-500 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileJson className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold">
                  {events.length} records
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-mono">data/events.json</h4>
              <p className="text-[11px] text-slate-500 mt-1">রিইউনিয়ন ও ইভেন্ট বুকিং ডাটা</p>
            </div>

            {/* 4. products.json */}
            <div 
              onClick={() => setSelectedJsonFile('products')}
              className={`p-4 rounded-none border transition cursor-pointer ${
                selectedJsonFile === 'products' 
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileJson className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold">
                  {products.length} records
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-mono">data/products.json</h4>
              <p className="text-[11px] text-slate-500 mt-1">অফিসিয়াল মার্চেন্ডাইজ ক্যাটালগ</p>
            </div>

            {/* 5. orders.json */}
            <div 
              onClick={() => setSelectedJsonFile('orders')}
              className={`p-4 rounded-none border transition cursor-pointer ${
                selectedJsonFile === 'orders' 
                  ? 'bg-rose-50/70 border-rose-500 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileJson className="w-4 h-4 text-rose-600" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-rose-100 text-rose-800 font-bold">
                  {orderInquiries.length} records
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 font-mono">data/orders.json</h4>
              <p className="text-[11px] text-slate-500 mt-1">অর্ডার ইনকোয়ারি ও রিকোয়েস্ট</p>
            </div>
          </div>

          {/* Live JSON Inspector Card */}
          <div className="bg-white rounded-none border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold tracking-wide font-mono">
                  data/{selectedJsonFile}.json
                </span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono">
                  {selectedJsonFile === 'users' ? users.length :
                   selectedJsonFile === 'posts' ? posts.length :
                   selectedJsonFile === 'events' ? events.length :
                   selectedJsonFile === 'products' ? products.length : orderInquiries.length} টি এন্ট্রি
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="copy-json-btn"
                  onClick={() => {
                    const content = JSON.stringify(
                      selectedJsonFile === 'users' ? users :
                      selectedJsonFile === 'posts' ? posts :
                      selectedJsonFile === 'events' ? events :
                      selectedJsonFile === 'products' ? products : orderInquiries,
                      null,
                      2
                    );
                    navigator.clipboard.writeText(content);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-none text-xs font-mono font-semibold transition flex items-center gap-1.5 border border-slate-700"
                >
                  <Check className={`w-3.5 h-3.5 ${copySuccess ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{copySuccess ? 'কপিকৃত!' : 'Copy JSON'}</span>
                </button>

                <button
                  id="download-json-btn"
                  onClick={() => {
                    const content = JSON.stringify(
                      selectedJsonFile === 'users' ? users :
                      selectedJsonFile === 'posts' ? posts :
                      selectedJsonFile === 'events' ? events :
                      selectedJsonFile === 'products' ? products : orderInquiries,
                      null,
                      2
                    );
                    const blob = new Blob([content], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedJsonFile}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-none text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Download .json</span>
                </button>
              </div>
            </div>

            {/* Code Display */}
            <div className="p-4 bg-slate-950 overflow-x-auto max-h-[500px]">
              <pre className="text-[12px] font-mono text-emerald-400 leading-relaxed">
                {JSON.stringify(
                  selectedJsonFile === 'users' ? users :
                  selectedJsonFile === 'posts' ? posts :
                  selectedJsonFile === 'events' ? events :
                  selectedJsonFile === 'products' ? products : orderInquiries,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}

      {showCredModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Change Admin Credentials</h3>
              </div>
              <button
                onClick={() => setShowCredModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Change the operator login username and password. Passwords are salted and hashed on the server.
            </p>

            {credMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                credMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                <span>{credMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangeCredentialsSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Operator Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Username
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCredModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={credLoading}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {credLoading ? 'Saving...' : 'Update Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD STUDENT ================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>Register New Student / Alumni Member</span>
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    placeholder="e.g. Shakil Mahmud"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nickname</label>
                  <input
                    type="text"
                    value={newStudentNickname}
                    onChange={e => setNewStudentNickname(e.target.value)}
                    placeholder="e.g. Shakil"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={e => setNewStudentEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={newStudentPhone}
                    onChange={e => setNewStudentPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Graduation Batch *</label>
                  <input
                    type="text"
                    required
                    value={newStudentBatch}
                    onChange={e => setNewStudentBatch(e.target.value)}
                    placeholder="e.g. SSC 2026, SSC 2018"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Class / Section</label>
                  <input
                    type="text"
                    value={newStudentSection}
                    onChange={e => setNewStudentSection(e.target.value)}
                    placeholder="e.g. Class 10, Section B"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Current Occupation / Institution</label>
                <input
                  type="text"
                  value={newStudentOccupation}
                  onChange={e => setNewStudentOccupation(e.target.value)}
                  placeholder="e.g. HSC Student / CSE Student / Software Engineer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newStudentLocation}
                  onChange={e => setNewStudentLocation(e.target.value)}
                  placeholder="Mymensingh, Bangladesh"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Status Upon Registration</label>
                <select
                  value={newStudentStatus}
                  onChange={e => setNewStudentStatus(e.target.value as UserStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="approved">Approved (Instantly Active in Directory)</option>
                  <option value="pending">Pending Approval</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT USER ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-600" />
                <span>Edit Student Record: {editingUser.name}</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={editingUser.batch}
                    onChange={e => setEditingUser({ ...editingUser, batch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Class & Section</label>
                <input
                  type="text"
                  value={editingUser.classSection || ''}
                  onChange={e => setEditingUser({ ...editingUser, classSection: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Current Occupation</label>
                <input
                  type="text"
                  value={editingUser.currentOccupation}
                  onChange={e => setEditingUser({ ...editingUser, currentOccupation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editingUser.status}
                  onChange={e => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending Approval</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE EVENT ================= */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span>Create Reunion or Institutional Event</span>
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  placeholder="e.g. Grand 55th Anniversary Reunion 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    placeholder="e.g. December 26, 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={e => setEventTime(e.target.value)}
                    placeholder="e.g. 9:00 AM – 6:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Venue</label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={e => setEventVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  placeholder="Details regarding registration, schedule, guests..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <span>Add School Souvenir / Merchandise</span>
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  placeholder="e.g. Mukul Niketon Alumni Commemorative Polo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Price (BDT)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={e => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={e => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Publication">Publication</option>
                    <option value="Keepsake">Keepsake</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Available Sizes (comma separated)</label>
                <input
                  type="text"
                  value={prodSizes}
                  onChange={e => setProdSizes(e.target.value)}
                  placeholder="S, M, L, XL, XXL"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={e => setProdDesc(e.target.value)}
                  placeholder="High quality cotton, embroidered school emblem..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold"
                >
                  Add to Souvenirs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Event Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-none border-2 border-red-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-10 h-10 rounded-none bg-red-100 flex items-center justify-center shrink-0 border border-red-300">
                <Trash2 className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">অনুষ্ঠান মুছে ফেলার নিশ্চিতকরণ</h3>
                <p className="text-xs text-slate-500 font-medium">Event Deletion Confirmation</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-700 leading-relaxed bg-red-50/50 p-3 rounded-none border border-red-200">
              আপনি কি নিশ্চিতভাবে <span className="font-bold text-slate-950">"{eventToDelete.title}"</span> অনুষ্ঠানটি সিস্টেম থেকে চিরতরে মুছে ফেলতে চান? <span className="text-red-700 font-bold">ওকে (OK)</span> চাপলে ইভেন্টটি মুছে যাবে।
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                id="cancel-delete-event-btn"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-none transition border border-slate-300 cursor-pointer"
              >
                বাতিল করুন (Cancel)
              </button>
              <button
                id="confirm-delete-event-ok-btn"
                onClick={() => {
                  deleteEvent(eventToDelete.id);
                  setEventToDelete(null);
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-none shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-300" />
                <span>হ্যাঁ, ডিলিট করুন (OK)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
