export type UserRole = 'student' | 'admin';
export type UserStatus = 'approved' | 'pending' | 'suspended';

export const isAdminName = (name?: string | null): boolean => {
  if (!name) return false;
  const lower = name.toLowerCase().trim();
  if (lower.includes('chowdhury onup amir')) return true;
  const clean = lower.replace(/[^a-z]/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean === 'chowdhury onup amir' || clean.includes('chowdhury onup amir')) return true;
  // Support Bengali transliteration
  if (lower.includes('অনুপ') && lower.includes('আমির')) return true;
  return false;
};

export interface SocialLinks {
  facebook?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  whatsapp?: string;
  website?: string;
}

export interface User {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  phone?: string;
  batch: string; // e.g. "SSC 2026", "SSC 2018"
  sscYear?: string; // e.g. "2026"
  admissionYear?: string; // e.g. "2016"
  classSection?: string; // e.g. "Class 10, Section B"
  rollNumber?: string; // e.g. "04"
  schoolYears?: string; // e.g. "2016 – 2026"
  fatherName?: string;
  bloodGroup?: string; // e.g. "B+", "A+", "O+", "AB+"
  currentOccupation: string; // e.g. "HSC Student / Engineer"
  organization?: string; // e.g. "Notre Dame College / Company"
  higherEducation?: string; // e.g. "Dhaka University"
  shortBio: string;
  location?: string; // e.g. "Mymensingh, Bangladesh"
  socialLinks?: SocialLinks;
  profilePhoto: string;
  coverPhoto?: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  showEmailPhone?: boolean; // privacy setting, false by default
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBatch: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBatch: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: string[]; // user IDs
  comments: Comment[];
  eventId?: string;
  eventData?: {
    title: string;
    date: string;
    time: string;
    venue: string;
  };
}

export interface ReunionEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  bannerUrl: string;
  status: 'upcoming' | 'past';
  attendeeCount: number;
  rsvps: string[]; // user IDs
  createdBy?: string;
  createdByName?: string;
  createdByBatch?: string;
  schedule?: { time: string; activity: string }[];
}

export interface Product {
  id: string;
  name: string;
  price: number; // in BDT
  category: string;
  description: string;
  imageUrl: string;
  availableSizes?: string[];
  inStock: boolean;
}

export interface OrderInquiry {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerBatch: string;
  buyerPhone: string;
  quantity: number;
  size?: string;
  notes?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'completed';
}

export type ActiveTab = 
  | 'home' 
  | 'about'
  | 'students' 
  | 'profile' 
  | 'reunion' 
  | 'community' 
  | 'marketplace' 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'admin';
