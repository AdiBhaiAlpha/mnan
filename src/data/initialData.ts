import { User, Post, ReunionEvent, Product } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-chowdhury-onup-amir',
    name: 'Chowdhury Onup Amir',
    nickname: 'Onup Amir',
    email: 'chowdhuryonupamir@gmail.com',
    phone: '+880 1711-000000',
    batch: 'School Administration & Trustee',
    classSection: 'Alumni Executive Board',
    schoolYears: '1970 – Present',
    currentOccupation: 'Executive Admin & Trustee, Mukul Niketon High School',
    shortBio: 'Executive Admin & Trustee of Mukul Niketon High School Alumni Association. Full administrative authority for platform moderation and event management.',
    location: '10, Maharaja Road, Mymensingh-2200',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'approved',
    joinedDate: '1970-01-01',
    showEmailPhone: true,
  },
  {
    id: 'user-admin',
    name: 'Mukul Niketon High School (Admin & Headmaster Office)',
    nickname: 'Headmaster Office',
    email: 'info@mukulniketonhs.edu.bd',
    phone: '+880 91-65400',
    batch: 'School Administration',
    classSection: 'Administrative Directorate',
    schoolYears: '1970 – Present',
    currentOccupation: 'Headmaster: Md. Shamsul Alam • Mukul Niketon High School',
    shortBio: 'Official administrative portal of Mukul Niketon High School, 10 Maharaja Road, Mymensingh. Founded in 1970 by Principal Amir Ahammad Chowdhury Ratan. EIIN: 111847.',
    location: '10, Maharaja Road, Mymensingh-2200',
    profilePhoto: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'approved',
    joinedDate: '1970-01-01',
    showEmailPhone: true,
  },
  {
    id: 'user-chitron',
    name: 'Chitron Bhattacharjee',
    nickname: 'Chitron',
    email: 'chitronbhattacharjee@gmail.com',
    phone: '+880 1712-345678',
    batch: 'SSC 2026',
    classSection: 'Class 10, Section A',
    schoolYears: '2016 – 2026',
    currentOccupation: 'Student & Alumni Volunteer, Mukul Niketon High School',
    shortBio: 'Proud student of Mukul Niketon High School. Technology and science enthusiast, working with alumni to preserve campus memories and connect batches.',
    location: 'Mymensingh, Bangladesh',
    socialLinks: {
      facebook: 'https://facebook.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    role: 'student',
    status: 'approved',
    joinedDate: '2026-01-15',
    showEmailPhone: false,
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-official-1',
    authorId: 'user-admin',
    authorName: 'Mukul Niketon High School (Admin & Headmaster Office)',
    authorAvatar: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80',
    authorBatch: 'School Administration',
    content: 'মুকুল নিকেতন উচ্চ বিদ্যালয়ের সকল প্রাক্তন ও বর্তমান শিক্ষার্থীদের জানাই আন্তরিক শুভেচ্ছা। ১৯৭০ সালে শ্রদ্ধেয় প্রতিষ্ঠাতা অধ্যক্ষ আমীর আহাম্মদ চৌধুরী রতন এর প্রতিষ্ঠিত এই বিদ্যাপীঠের সকল ব্যাচের শিক্ষার্থীদের একত্রিত করতে এই ডিজিটাল ডিরেক্টরি ও পুনর্মিলনী পোর্টাল চালু করা হয়েছে। সকল প্রাক্তনীকে প্ল্যাটফর্মে যুক্ত হয়ে নিজেদের তথ্য আপডেট করার আহ্বান জানাচ্ছি।',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    createdAt: 'Official Notice',
    likes: ['user-chitron'],
    comments: [
      {
        id: 'c-admin-1',
        authorId: 'user-chitron',
        authorName: 'Chitron Bhattacharjee',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
        authorBatch: 'SSC 2026',
        content: 'আমাদের প্রিয় মুকুল নিকেতনের সকল শিক্ষক-শিক্ষিকাদের প্রতি সশ্রদ্ধ সালাম। আমরা সকল শিক্ষার্থীরা একসাথে বিদ্যালয়ের ঐতিহ্য সমুন্নত রাখতে অঙ্গীকারবদ্ধ।',
        createdAt: '1 day ago'
      }
    ]
  },
  {
    id: 'post-official-2',
    authorId: 'user-chitron',
    authorName: 'Chitron Bhattacharjee',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    authorBatch: 'SSC 2026',
    content: '১০ মহারাজা রোডের আমাদের স্কুল ক্যাম্পাস, সকালের সমাবেশ, বিতর্ক ক্লাবের সেশন আর বার্ষিক ক্রীড়া দিবসের স্মৃতিগুলো চির অম্লান। সকল ব্যাচের সিনিয়র ও জুনিয়র বন্ধুদের প্ল্যাটফর্মে স্বাগত!',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    createdAt: 'Community Welcome',
    likes: ['user-admin'],
    comments: []
  }
];

export const INITIAL_EVENTS: ReunionEvent[] = [
  {
    id: 'event-reunion-2027',
    title: 'Mukul Niketon Grand Alumni Reunion 2027 (৫৫ বছর পূর্তি উৎসব)',
    date: 'February 12 – 13, 2027',
    time: '09:00 AM – 07:00 PM BST',
    venue: 'Mukul Niketon High School Main Campus & Auditorium, 10 Maharaja Road, Mymensingh',
    description: 'The monumental grand gathering of all batches of Mukul Niketon High School alumni. Honoring our respected teachers, batch commemorative sessions, cultural performances, and traditional alumni banquet.',
    bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
    status: 'upcoming',
    attendeeCount: 1,
    rsvps: ['user-chitron'],
    schedule: [
      { time: '09:00 AM', activity: 'Registration & Welcome Kit Collection at Campus Gate' },
      { time: '10:30 AM', activity: 'National Anthem, School Song & Inauguration by Respected Teachers' },
      { time: '12:00 PM', activity: 'Batch-wise Commemorative Photography Session' },
      { time: '01:30 PM', activity: 'Grand Traditional Reunion Lunch' },
      { time: '03:30 PM', activity: 'Reminiscence Stage & Founder Principal Amir Ahammad Chowdhury Ratan Memorial Session' },
      { time: '06:00 PM', activity: 'Cultural Evening: Song, Dance, Recitation by Alumni' }
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Mukul Niketon Official Heritage Crest Polo Shirt',
    price: 650,
    category: 'Apparel',
    description: 'Premium combed cotton pique fabric with finely embroidered Mukul Niketon School seal on the chest and commemorative batch badge.',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Commemorative Navy Pullover Hoodie',
    price: 1250,
    category: 'Winterwear',
    description: 'Heavyweight fleece hoodie in iconic school navy, featuring official Mukul Niketon High School typography.',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    availableSizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'Alumni Keepsake Ceramic Monogram Mug',
    price: 320,
    category: 'Souvenir',
    description: 'Glossy ceramic mug with golden Mukul Niketon monogram and founding year 1970.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'Institutional Hardcover Journal & Pen Set',
    price: 450,
    category: 'Stationery',
    description: 'Embossed leatherette notebook with 180 GSM natural pages and matte metal rollerball pen bearing the school crest.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    inStock: true
  }
];
