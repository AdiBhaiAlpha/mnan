import { User, Post, ReunionEvent, Product } from '../types';

// System Administrator account for platform operations & initial database sync
export const INITIAL_USERS: User[] = [
  {
    id: 'user-chowdhury-onup-amir',
    name: 'Chowdhury Onup Amir',
    nickname: 'অনুপ আমির',
    email: 'chowdhuryonupamir@gmail.com',
    phone: '01711000000',
    batch: 'SSC 2005',
    sscYear: '2005',
    admissionYear: '1995',
    schoolYears: '1995 – 2005',
    classSection: 'বিজ্ঞান বিভাগ (Science)',
    currentOccupation: 'সিস্টেম অ্যাডমিনিস্ট্রেটর ও প্রাক্তনী সংগঠক',
    shortBio: 'মুকুল নিকেতন উচ্চ বিদ্যালয়ের প্রাক্তন শিক্ষার্থী এবং ডিজিটাল অ্যালামনাই প্ল্যাটফর্মের সার্বিক সমন্বয়ক ও প্রশাসক।',
    location: 'ময়মনসিংহ, বাংলাদেশ',
    role: 'admin',
    status: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
    joinedDate: '২০২৫-০১-০১',
    bloodGroup: 'B+'
  }
];

export const INITIAL_POSTS: Post[] = [];
export const INITIAL_EVENTS: ReunionEvent[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
