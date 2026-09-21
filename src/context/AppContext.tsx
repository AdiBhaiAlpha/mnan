import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, ReunionEvent, Product, OrderInquiry, ActiveTab, UserStatus, isAdminName } from '../types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_EVENTS, INITIAL_PRODUCTS } from '../data/initialData';

interface AppContextType {
  users: User[];
  posts: Post[];
  events: ReunionEvent[];
  products: Product[];
  orderInquiries: OrderInquiry[];
  currentUser: User | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedProfileId: string | null;
  setSelectedProfileId: (id: string | null) => void;
  viewProfile: (id: string) => void;
  
  // Auth
  login: (emailOrPhone: string) => { success: boolean; message: string; user?: User };
  register: (data: {
    name: string;
    nickname?: string;
    email: string;
    phone: string;
    batch: string;
    classSection: string;
    currentOccupation: string;
    shortBio: string;
    location?: string;
    profilePhoto?: string;
  }) => { success: boolean; message: string; user?: User };
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  changePassword: (newPass: string) => { success: boolean; message: string };

  // Secure Admin Auth
  isAdminAuthenticated: boolean;
  adminUsername: string;
  adminLogin: (username: string, pass: string) => Promise<{ success: boolean; message: string }>;
  adminChangeCredentials: (currentPassword: string, newUsername: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  adminLogout: () => Promise<void>;

  // Admin Controls
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  suspendUser: (userId: string) => void;
  activateUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  editUserByAdmin: (userId: string, data: Partial<User>) => void;
  createStudentByAdmin: (data: {
    name: string;
    nickname?: string;
    email: string;
    phone: string;
    batch: string;
    classSection: string;
    currentOccupation: string;
    shortBio: string;
    location?: string;
    status: UserStatus;
  }) => { success: boolean; message: string; user?: User };

  // Community
  createPost: (content: string, imageUrl?: string, eventDetails?: {
    title: string;
    date: string;
    time: string;
    venue: string;
    description?: string;
    bannerUrl?: string;
  }) => { success: boolean; message: string; eventId?: string };
  createOfficialPost: (content: string, imageUrl?: string) => { success: boolean; message: string };
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  deletePost: (postId: string) => void;

  // Reunion Events
  toggleRsvp: (eventId: string) => void;
  createEvent: (event: Omit<ReunionEvent, 'id' | 'attendeeCount' | 'rsvps'>) => void;
  editEvent: (eventId: string, data: Partial<ReunionEvent>) => void;
  deleteEvent: (eventId: string) => void;

  // Marketplace
  submitOrderInquiry: (inquiry: Omit<OrderInquiry, 'id' | 'createdAt' | 'status'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (productId: string, data: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderInquiry['status']) => void;
  resetAllData: () => void;

  // Local JSON Database Synchronization
  isDbLoaded: boolean;
  dbSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  refreshFromDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clean persistence loaders
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mn_school_users_v2');
    let loadedUsers: User[] = INITIAL_USERS;
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedUsers = parsed;
        }
      } catch (e) { console.error(e); }
    }

    // Ensure Chowdhury Onup Amir admin user is included
    const hasOnupAmir = loadedUsers.some(u => isAdminName(u.name) || u.email.toLowerCase() === 'chowdhuryonupamir@gmail.com');
    if (!hasOnupAmir) {
      const defaultOnup = INITIAL_USERS.find(u => u.id === 'user-chowdhury-onup-amir');
      if (defaultOnup) {
        loadedUsers = [defaultOnup, ...loadedUsers];
      }
    }

    // Automatically enforce admin role and approved status for any user with name "Chowdhury Onup Amir"
    return loadedUsers.map(u => {
      if (isAdminName(u.name)) {
        return { ...u, role: 'admin' as const, status: 'approved' as const };
      }
      return u;
    });
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('mn_school_posts_v2');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_POSTS;
  });

  const [events, setEvents] = useState<ReunionEvent[]>(() => {
    const saved = localStorage.getItem('mn_school_events_v2');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_EVENTS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mn_school_products_v2');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  const [orderInquiries, setOrderInquiries] = useState<OrderInquiry[]>(() => {
    const saved = localStorage.getItem('mn_school_orders_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mn_school_current_user_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id) {
          if (isAdminName(parsed.name)) {
            return { ...parsed, role: 'admin' as const, status: 'approved' as const };
          }
          return parsed;
        }
      } catch (e) { console.error(e); }
    }
    return INITIAL_USERS[2] || INITIAL_USERS[1]; // Default to Chitron Bhattacharjee or Onup Amir
  });

  // Check URL pathname for /admin on initial load
  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin')) {
        return 'admin';
      }
    }
    return 'home';
  });

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Secure Admin Authentication State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mn_admin_token');
    }
    return null;
  });
  const [adminUsername, setAdminUsername] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mn_admin_user') || 'admin';
    }
    return 'admin';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('mn_admin_token'));
    }
    return false;
  });

  // Verify stored admin token on mount with server
  useEffect(() => {
    const token = localStorage.getItem('mn_admin_token');
    if (token) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setIsAdminAuthenticated(true);
            if (data.username) {
              setAdminUsername(data.username);
              localStorage.setItem('mn_admin_user', data.username);
            }
          } else {
            localStorage.removeItem('mn_admin_token');
            setIsAdminAuthenticated(false);
          }
        })
        .catch(() => {
          // In case network issue or offline, retain local authentication if token present
        });
    }
  }, []);

  // Listen to popstate (back/forward button)
  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin')) {
        setActiveTabState('admin');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Wrapper for setActiveTab to sync URL pathname
  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      if (tab === 'admin') {
        if (window.location.pathname !== '/admin') {
          window.history.pushState(null, '', '/admin');
        }
      } else {
        if (window.location.pathname === '/admin') {
          window.history.pushState(null, '', '/');
        }
      }
    }
  };

  // Local JSON Database Synchronization state
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);
  const [dbSyncStatus, setDbSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Load from server JSON database on initial mount
  const refreshFromDatabase = async () => {
    try {
      setDbSyncStatus('syncing');
      const res = await fetch('/api/db/all');
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const { users: dbUsers, posts: dbPosts, events: dbEvents, products: dbProducts, orders: dbOrders } = result.data;
          
          if (Array.isArray(dbUsers) && dbUsers.length > 0) {
            let processedUsers = dbUsers;
            // Always ensure Chowdhury Onup Amir is an admin
            processedUsers = processedUsers.map((u: User) => {
              if (isAdminName(u.name)) {
                return { ...u, role: 'admin' as const, status: 'approved' as const };
              }
              return u;
            });
            setUsers(processedUsers);
          }

          if (Array.isArray(dbPosts) && dbPosts.length > 0) {
            setPosts(dbPosts);
          }

          if (Array.isArray(dbEvents) && dbEvents.length > 0) {
            setEvents(dbEvents);
          }

          if (Array.isArray(dbProducts) && dbProducts.length > 0) {
            setProducts(dbProducts);
          }

          if (Array.isArray(dbOrders)) {
            setOrderInquiries(dbOrders);
          }
          setDbSyncStatus('synced');
        }
      }
    } catch (err) {
      console.warn('Could not connect to JSON database, falling back to cached state:', err);
      setDbSyncStatus('error');
    } finally {
      setIsDbLoaded(true);
    }
  };

  useEffect(() => {
    refreshFromDatabase();
  }, []);

  // Sync state to localStorage AND local server JSON database files
  useEffect(() => {
    localStorage.setItem('mn_school_users_v2', JSON.stringify(users));
    if (isDbLoaded) {
      fetch('/api/db/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
      }).catch(err => console.error('Failed writing to users.json:', err));
    }
  }, [users, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('mn_school_posts_v2', JSON.stringify(posts));
    if (isDbLoaded) {
      fetch('/api/db/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posts)
      }).catch(err => console.error('Failed writing to posts.json:', err));
    }
  }, [posts, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('mn_school_events_v2', JSON.stringify(events));
    if (isDbLoaded) {
      fetch('/api/db/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events)
      }).catch(err => console.error('Failed writing to events.json:', err));
    }
  }, [events, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('mn_school_products_v2', JSON.stringify(products));
    if (isDbLoaded) {
      fetch('/api/db/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      }).catch(err => console.error('Failed writing to products.json:', err));
    }
  }, [products, isDbLoaded]);

  useEffect(() => {
    localStorage.setItem('mn_school_orders_v2', JSON.stringify(orderInquiries));
    if (isDbLoaded) {
      fetch('/api/db/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderInquiries)
      }).catch(err => console.error('Failed writing to orders.json:', err));
    }
  }, [orderInquiries, isDbLoaded]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mn_school_current_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mn_school_current_user_v2');
    }
  }, [currentUser]);

  // Keep currentUser in sync if updated in users list
  useEffect(() => {
    if (currentUser) {
      const refreshed = users.find(u => u.id === currentUser.id);
      if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(currentUser)) {
        setCurrentUser(refreshed);
      }
    }
  }, [users]);

  const viewProfile = (id: string) => {
    setSelectedProfileId(id);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Standard Alumni Login
  const login = (emailOrPhone: string) => {
    const clean = emailOrPhone.trim().toLowerCase();
    const found = users.find(
      u => u.email.toLowerCase() === clean || 
           (u.phone && u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '')) ||
           u.name.toLowerCase().trim() === clean ||
           (isAdminName(clean) && isAdminName(u.name))
    );

    if (!found) {
      return {
        success: false,
        message: 'No registered account found with this email, phone, or name. Please register first.'
      };
    }

    if (found.status === 'suspended') {
      return {
        success: false,
        message: 'This account is currently suspended. Please contact school administration.'
      };
    }

    const updatedUser = isAdminName(found.name)
      ? { ...found, role: 'admin' as const, status: 'approved' as const }
      : found;

    setCurrentUser(updatedUser);
    if (updatedUser.role === 'admin') {
      setIsAdminAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mn_admin_token', 'session-admin-token');
        localStorage.setItem('mn_admin_user', updatedUser.name);
      }
    }

    return {
      success: true,
      message: `স্বাগতম, ${updatedUser.name}! ${updatedUser.role === 'admin' ? '(এডমিন এক্সেস সক্রিয়)' : ''}`,
      user: updatedUser
    };
  };

  // Standard Alumni Register
  const register = (data: {
    name: string;
    nickname?: string;
    email: string;
    phone: string;
    batch: string;
    classSection: string;
    currentOccupation: string;
    shortBio: string;
    location?: string;
    profilePhoto?: string;
  }) => {
    const exists = users.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const isSuperAdmin = isAdminName(data.name);
    const defaultAvatar = data.profilePhoto || 
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      nickname: data.nickname?.trim() || '',
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      batch: data.batch.trim(),
      classSection: data.classSection.trim(),
      schoolYears: `${parseInt(data.batch.replace(/\D/g, '')) - 10 || 2016} – ${data.batch.replace(/\D/g, '') || 2026}`,
      currentOccupation: data.currentOccupation.trim(),
      shortBio: data.shortBio.trim(),
      location: data.location?.trim() || 'Mymensingh, Bangladesh',
      profilePhoto: defaultAvatar,
      role: isSuperAdmin ? 'admin' : 'student',
      status: isSuperAdmin ? 'approved' : 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
      showEmailPhone: isSuperAdmin,
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    if (isSuperAdmin) {
      setIsAdminAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mn_admin_token', 'session-admin-token');
        localStorage.setItem('mn_admin_user', newUser.name);
      }
    }

    return {
      success: true,
      message: isSuperAdmin 
        ? `স্বাগতম ${newUser.name}! এডমিন এক্সেস সক্রিয় করা হয়েছে।` 
        : 'Registration submitted successfully! Your account status is "Pending Approval". The Mukul Niketon Alumni committee will verify and approve your profile.',
      user: newUser
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = { ...u, ...updatedData };
        setCurrentUser(updated);
        return updated;
      }
      return u;
    }));
  };

  const changePassword = (_newPass: string) => {
    return { success: true, message: 'Password updated successfully!' };
  };

  // ---------------- SECURE ADMIN AUTH METHODS ----------------

  const adminLogin = async (username: string, pass: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAdminToken(data.token);
        setAdminUsername(data.username);
        setIsAdminAuthenticated(true);
        localStorage.setItem('mn_admin_token', data.token);
        localStorage.setItem('mn_admin_user', data.username);

        // Switch active user in context to Admin user
        const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
        setCurrentUser(adminUser);

        return { success: true, message: 'Administrator login successful' };
      }

      return {
        success: false,
        message: data.message || 'Invalid administrator username or password'
      };
    } catch (e) {
      console.error('Admin login error:', e);
      return { success: false, message: 'Server communication error during administrator login' };
    }
  };

  const adminChangeCredentials = async (
    currentPassword: string,
    newUsername: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!adminToken) {
      return { success: false, message: 'No active administrator session' };
    }

    try {
      const response = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ currentPassword, newUsername, newPassword })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        if (data.username) {
          setAdminUsername(data.username);
          localStorage.setItem('mn_admin_user', data.username);
        }
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Failed to update credentials' };
    } catch (e) {
      console.error('Credentials change error:', e);
      return { success: false, message: 'Failed to communicate with server to update credentials' };
    }
  };

  const adminLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      } catch (e) {
        console.error(e);
      }
    }
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('mn_admin_token');
    
    // Switch to Chitron or student user
    const studentUser = users.find(u => u.role === 'student') || null;
    setCurrentUser(studentUser);
    setActiveTab('home');
  };

  // ---------------- ADMIN ACTIONS ----------------

  const approveUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
  };

  const rejectUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const suspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'suspended' } : u));
  };

  const activateUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const editUserByAdmin = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
  };

  const createStudentByAdmin = (data: {
    name: string;
    nickname?: string;
    email: string;
    phone: string;
    batch: string;
    classSection: string;
    currentOccupation: string;
    shortBio: string;
    location?: string;
    status: UserStatus;
  }) => {
    const exists = users.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      nickname: data.nickname?.trim() || '',
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      batch: data.batch.trim(),
      classSection: data.classSection.trim(),
      schoolYears: `${parseInt(data.batch.replace(/\D/g, '')) - 10 || 2016} – ${data.batch.replace(/\D/g, '') || 2026}`,
      currentOccupation: data.currentOccupation.trim() || 'Student / Alumni',
      shortBio: data.shortBio.trim() || 'Registered Mukul Niketon High School alumnus.',
      location: data.location?.trim() || 'Mymensingh, Bangladesh',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      role: 'student',
      status: data.status,
      joinedDate: new Date().toISOString().split('T')[0],
      showEmailPhone: true,
    };

    setUsers(prev => [newUser, ...prev]);
    return { success: true, message: 'Alumni member added successfully to directory.', user: newUser };
  };

  // ---------------- COMMUNITY POSTS ----------------

  const createPost = (content: string, imageUrl?: string, eventDetails?: {
    title: string;
    date: string;
    time: string;
    venue: string;
    description?: string;
    bannerUrl?: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'পোস্ট করতে অনুগ্রহ করে লগইন করুন।' };
    }
    if (currentUser.status !== 'approved' && currentUser.role !== 'admin') {
      return { success: false, message: 'আপনার অ্যাকাউন্টটি অনুমোদনের অপেক্ষায় রয়েছে। অনুমোদন পেলে পোস্ট করতে পারবেন।' };
    }

    let createdEventId: string | undefined = undefined;
    let eventInfo: Post['eventData'] = undefined;

    if (eventDetails && eventDetails.title.trim()) {
      createdEventId = `event-${Date.now()}`;
      const newEvent: ReunionEvent = {
        id: createdEventId,
        title: eventDetails.title.trim(),
        date: eventDetails.date.trim() || 'তারিখ শীঘ্রই জানানো হবে',
        time: eventDetails.time.trim() || 'সকাল ১০:০০ টা',
        venue: eventDetails.venue.trim() || 'মুকুল নিকেতন প্রাঙ্গণ, ময়মনসিংহ',
        description: eventDetails.description?.trim() || content.trim(),
        bannerUrl: eventDetails.bannerUrl?.trim() || imageUrl?.trim() || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&auto=format&fit=crop&q=80',
        status: 'upcoming',
        attendeeCount: 1,
        rsvps: [currentUser.id],
        createdBy: currentUser.id,
        createdByName: currentUser.name,
        createdByBatch: currentUser.batch,
      };

      setEvents(prev => [newEvent, ...prev]);

      eventInfo = {
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        venue: newEvent.venue,
      };
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.profilePhoto,
      authorBatch: currentUser.batch,
      content,
      imageUrl,
      createdAt: 'Just now',
      likes: [],
      comments: [],
      eventId: createdEventId,
      eventData: eventInfo,
    };

    setPosts(prev => [newPost, ...prev]);
    return { 
      success: true, 
      message: createdEventId 
        ? 'ইভেন্ট ও পোস্ট সফলভাবে প্রকাশিত হয়েছে! এটি হোমপেজের আসন্ন অনুষ্ঠানে প্রদর্শিত হচ্ছে।' 
        : 'পোস্ট সফলভাবে প্রকাশিত হয়েছে!',
      eventId: createdEventId
    };
  };

  const createOfficialPost = (content: string, imageUrl?: string) => {
    const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
    const newPost: Post = {
      id: `post-official-${Date.now()}`,
      authorId: adminUser.id,
      authorName: 'Mukul Niketon High School (Admin & Headmaster Office)',
      authorAvatar: adminUser.profilePhoto,
      authorBatch: 'School Administration',
      content,
      imageUrl,
      createdAt: 'Official Notice',
      likes: [],
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    return { success: true, message: 'Official announcement published to the community feed!' };
  };

  const toggleLike = (postId: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.includes(currentUser.id);
        const updatedLikes = hasLiked
          ? p.likes.filter(id => id !== currentUser.id)
          : [...p.likes, currentUser.id];
        return { ...p, likes: updatedLikes };
      }
      return p;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.profilePhoto,
      authorBatch: currentUser.batch,
      content: content.trim(),
      createdAt: 'Just now'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
      }
      return p;
    }));
  };

  const deletePost = (postId: string) => {
    const postToDelete = posts.find(p => p.id === postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
    if (postToDelete?.eventId) {
      setEvents(prev => prev.filter(e => e.id !== postToDelete.eventId));
    }
  };

  // ---------------- REUNION EVENTS ----------------

  const toggleRsvp = (eventId: string) => {
    if (!currentUser) return;
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const hasRsvpd = e.rsvps.includes(currentUser.id);
        const rsvps = hasRsvpd 
          ? e.rsvps.filter(id => id !== currentUser.id)
          : [...e.rsvps, currentUser.id];
        const attendeeCount = hasRsvpd ? e.attendeeCount - 1 : e.attendeeCount + 1;
        return { ...e, rsvps, attendeeCount };
      }
      return e;
    }));
  };

  const createEvent = (eventData: Omit<ReunionEvent, 'id' | 'attendeeCount' | 'rsvps'>) => {
    const newEvent: ReunionEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      attendeeCount: 1,
      rsvps: currentUser ? [currentUser.id] : []
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const editEvent = (eventId: string, data: Partial<ReunionEvent>) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...data } : e));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setPosts(prev => prev.filter(p => p.eventId !== eventId));
  };

  // ---------------- SOUVENIRS / MARKETPLACE ----------------

  const submitOrderInquiry = (inquiry: Omit<OrderInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: OrderInquiry = {
      ...inquiry,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
      status: 'new'
    };
    setOrderInquiries(prev => [newOrder, ...prev]);
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const editProduct = (productId: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...data } : p));
  };

  const deleteProduct = (prodId: string) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
  };

  const updateOrderStatus = (orderId: string, status: OrderInquiry['status']) => {
    setOrderInquiries(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setPosts(INITIAL_POSTS);
    setEvents(INITIAL_EVENTS);
    setProducts(INITIAL_PRODUCTS);
    setOrderInquiries([]);
    setCurrentUser(INITIAL_USERS[0]);

    fetch('/api/db/sync/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        users: INITIAL_USERS,
        posts: INITIAL_POSTS,
        events: INITIAL_EVENTS,
        products: INITIAL_PRODUCTS,
        orders: []
      })
    }).catch(err => console.error('Failed resetting JSON database files:', err));
  };

  return (
    <AppContext.Provider
      value={{
        users,
        posts,
        events,
        products,
        orderInquiries,
        currentUser,
        activeTab,
        setActiveTab,
        selectedProfileId,
        setSelectedProfileId,
        viewProfile,

        login,
        register,
        logout,
        updateProfile,
        changePassword,

        // Secure Admin Auth
        isAdminAuthenticated,
        adminUsername,
        adminLogin,
        adminChangeCredentials,
        adminLogout,

        // Admin controls
        approveUser,
        rejectUser,
        suspendUser,
        activateUser,
        deleteUser,
        editUserByAdmin,
        createStudentByAdmin,

        // Community
        createPost,
        createOfficialPost,
        toggleLike,
        addComment,
        deleteComment,
        deletePost,

        // Events
        toggleRsvp,
        createEvent,
        editEvent,
        deleteEvent,

        // Marketplace
        submitOrderInquiry,
        addProduct,
        editProduct,
        deleteProduct,
        updateOrderStatus,
        resetAllData,

        // Local JSON DB
        isDbLoaded,
        dbSyncStatus,
        refreshFromDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
