import { User, Post, ReunionEvent, Product } from '../types';

// The verified platform administrator account is preserved so admin operations,
// batch approvals, and announcements are accessible.
// All mock, fake, and demo student/user accounts have been completely removed.
export const INITIAL_USERS: User[] = [];

// All mock/fake/demo posts have been removed.
// Real community posts will be created by logged-in verified alumni and administration.
export const INITIAL_POSTS: Post[] = [];

// All mock/fake/demo events have been removed.
// Real alumni reunions and events will be announced by alumni and school administration.
export const INITIAL_EVENTS: ReunionEvent[] = [];

// Official school souvenirs and publications (can be added by administrator)
export const INITIAL_PRODUCTS: Product[] = [];
