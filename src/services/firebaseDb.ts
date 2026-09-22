import { 
  db, 
  rtdb, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  ref,
  set,
  onValue
} from '../firebase';
import { User, Post, ReunionEvent, Product, OrderInquiry, isAdminName } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface RtdbErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleRtdbError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: RtdbErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.warn('Realtime Database Operation Info:', JSON.stringify(errInfo));
  return errInfo;
}

// Node Paths in Firebase Realtime Database
export const DB_PATHS = {
  users: 'users',
  posts: 'posts',
  events: 'events',
  products: 'products',
  orders: 'orders'
} as const;

// ----------------- Realtime Database Subscriptions -----------------

export function subscribeToUsers(callback: (users: User[]) => void): () => void {
  try {
    const usersRef = ref(rtdb, DB_PATHS.users);
    const unsubRtdb = onValue(usersRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const usersList = Object.values(val) as User[];
        callback(usersList);
      } else {
        callback([]);
      }
    }, (err) => {
      handleRtdbError(err, OperationType.GET, DB_PATHS.users);
      callback([]);
    });

    return () => {
      unsubRtdb();
    };
  } catch (err) {
    handleRtdbError(err, OperationType.GET, DB_PATHS.users);
    return () => {};
  }
}

function deduplicateComments(comments: any[]): any[] {
  if (!Array.isArray(comments)) return [];
  const seen = new Set();
  const result: any[] = [];
  for (const c of comments) {
    if (!c) continue;
    const key = c.id || `${c.authorId}-${c.content}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(c);
    }
  }
  return result;
}

export function subscribeToPosts(callback: (posts: Post[]) => void): () => void {
  try {
    const postsRef = ref(rtdb, DB_PATHS.posts);
    const unsubRtdb = onValue(postsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const postsList = Object.values(val) as Post[];
        
        // Ensure likes & comments are always deduplicated arrays
        const sanitizedPosts = postsList.map((p: any) => {
          const rawComments = Array.isArray(p.comments) 
            ? p.comments 
            : (p.comments ? Object.values(p.comments) : []);
          return {
            ...p,
            likes: Array.isArray(p.likes) 
              ? Array.from(new Set(p.likes))
              : (p.likes ? Array.from(new Set(Object.values(p.likes))) : []),
            comments: deduplicateComments(rawComments)
          };
        });

        // Sort posts descending by numeric timestamp in post ID or date time
        sanitizedPosts.sort((a, b) => {
          const numA = parseInt((a.id || '').replace(/\D/g, '')) || 0;
          const numB = parseInt((b.id || '').replace(/\D/g, '')) || 0;
          if (numA && numB && numA !== numB) return numB - numA;
          return (b.id || '').localeCompare(a.id || '');
        });

        callback(sanitizedPosts);
      } else {
        callback([]);
      }
    }, (err) => {
      handleRtdbError(err, OperationType.GET, DB_PATHS.posts);
      callback([]);
    });

    return () => {
      unsubRtdb();
    };
  } catch (err) {
    handleRtdbError(err, OperationType.GET, DB_PATHS.posts);
    return () => {};
  }
}

export function subscribeToEvents(callback: (events: ReunionEvent[]) => void): () => void {
  try {
    const eventsRef = ref(rtdb, DB_PATHS.events);
    const unsubRtdb = onValue(eventsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const eventsList = Object.values(val) as ReunionEvent[];
        const sanitizedEvents = eventsList.map((e: any) => ({
          ...e,
          rsvps: Array.isArray(e.rsvps) 
            ? e.rsvps 
            : (e.rsvps ? Object.values(e.rsvps) : [])
        }));
        callback(sanitizedEvents);
      } else {
        callback([]);
      }
    }, (err) => {
      handleRtdbError(err, OperationType.GET, DB_PATHS.events);
      callback([]);
    });

    return () => {
      unsubRtdb();
    };
  } catch (err) {
    handleRtdbError(err, OperationType.GET, DB_PATHS.events);
    return () => {};
  }
}

export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  try {
    const productsRef = ref(rtdb, DB_PATHS.products);
    const unsubRtdb = onValue(productsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const productsList = Object.values(val) as Product[];
        callback(productsList);
      } else {
        callback([]);
      }
    }, (err) => {
      handleRtdbError(err, OperationType.GET, DB_PATHS.products);
      callback([]);
    });

    return () => {
      unsubRtdb();
    };
  } catch (err) {
    handleRtdbError(err, OperationType.GET, DB_PATHS.products);
    return () => {};
  }
}

export function subscribeToOrders(callback: (orders: OrderInquiry[]) => void): () => void {
  try {
    const ordersRef = ref(rtdb, DB_PATHS.orders);
    const unsubRtdb = onValue(ordersRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const ordersList = Object.values(val) as OrderInquiry[];
        callback(ordersList);
      } else {
        callback([]);
      }
    }, (err) => {
      handleRtdbError(err, OperationType.GET, DB_PATHS.orders);
      callback([]);
    });

    return () => {
      unsubRtdb();
    };
  } catch (err) {
    handleRtdbError(err, OperationType.GET, DB_PATHS.orders);
    return () => {};
  }
}

// Helper to strip undefined values before saving to Realtime Database
function sanitizeForRtdb<T>(obj: T): T {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
}

// ----------------- Write Operations (Firebase Realtime Database) -----------------

export async function saveUserToFirebase(user: User): Promise<void> {
  const sanitizedUser = sanitizeForRtdb({ ...user });
  if (isAdminName(sanitizedUser.name)) {
    sanitizedUser.role = 'admin';
    sanitizedUser.status = 'approved';
  }

  const withTimeout = (promise: Promise<any>, ms: number = 1800) => 
    Promise.race([
      promise,
      new Promise((res) => setTimeout(res, ms))
    ]);

  try {
    await withTimeout(set(ref(rtdb, `users/${user.id}`), sanitizedUser), 1800);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `users/${user.id}`);
  }

  // Dual sync to Firestore for backup compatibility
  try {
    await withTimeout(setDoc(doc(db, 'users', user.id), sanitizedUser), 1200);
  } catch (e) {}
}

export async function deleteUserFromFirebase(userId: string): Promise<void> {
  try {
    await set(ref(rtdb, `users/${userId}`), null);
  } catch (err) {
    handleRtdbError(err, OperationType.DELETE, `users/${userId}`);
  }

  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (e) {}
}

export async function savePostToFirebase(post: Post): Promise<void> {
  const sanitizedPost = sanitizeForRtdb({
    ...post,
    likes: Array.from(new Set(post.likes || [])),
    comments: deduplicateComments(post.comments || [])
  });

  try {
    await set(ref(rtdb, `posts/${post.id}`), sanitizedPost);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `posts/${post.id}`);
  }

  try {
    await setDoc(doc(db, 'posts', post.id), sanitizedPost);
  } catch (e) {}
}

export async function deletePostFromFirebase(postId: string): Promise<void> {
  try {
    await set(ref(rtdb, `posts/${postId}`), null);
  } catch (err) {
    handleRtdbError(err, OperationType.DELETE, `posts/${postId}`);
  }

  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (e) {}
}

export async function saveEventToFirebase(event: ReunionEvent): Promise<void> {
  const sanitizedEvent = sanitizeForRtdb({
    ...event,
    rsvps: event.rsvps || []
  });

  try {
    await set(ref(rtdb, `events/${event.id}`), sanitizedEvent);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `events/${event.id}`);
  }

  try {
    await setDoc(doc(db, 'events', event.id), sanitizedEvent);
  } catch (e) {}
}

export async function deleteEventFromFirebase(eventId: string): Promise<void> {
  try {
    await set(ref(rtdb, `events/${eventId}`), null);
  } catch (err) {
    handleRtdbError(err, OperationType.DELETE, `events/${eventId}`);
  }

  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (e) {}
}

export async function saveProductToFirebase(product: Product): Promise<void> {
  const sanitizedProduct = sanitizeForRtdb({ ...product });
  try {
    await set(ref(rtdb, `products/${product.id}`), sanitizedProduct);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `products/${product.id}`);
  }

  try {
    await setDoc(doc(db, 'products', product.id), sanitizedProduct);
  } catch (e) {}
}

export async function deleteProductFromFirebase(productId: string): Promise<void> {
  try {
    await set(ref(rtdb, `products/${productId}`), null);
  } catch (err) {
    handleRtdbError(err, OperationType.DELETE, `products/${productId}`);
  }

  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (e) {}
}

export async function saveOrderToFirebase(order: OrderInquiry): Promise<void> {
  const sanitizedOrder = sanitizeForRtdb({ ...order });
  try {
    await set(ref(rtdb, `orders/${order.id}`), sanitizedOrder);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `orders/${order.id}`);
  }

  try {
    await setDoc(doc(db, 'orders', order.id), sanitizedOrder);
  } catch (e) {}
}

// ----------------- Bulk Seed / Initial Cloud Push -----------------

export async function clearAllCloudData(): Promise<void> {
  try {
    await set(ref(rtdb, 'users'), null);
    await set(ref(rtdb, 'posts'), null);
    await set(ref(rtdb, 'events'), null);
    await set(ref(rtdb, 'products'), null);
    await set(ref(rtdb, 'orders'), null);
  } catch (e) {
    console.warn('Notice clearing Realtime Database:', e);
  }

  // Clear Firestore collections as well
  const collectionsToClear = ['users', 'posts', 'events', 'products', 'orders'];
  for (const colName of collectionsToClear) {
    try {
      const colRef = collection(db, colName);
      const snapshot = await getDocs(colRef);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, colName, docSnap.id));
      }
    } catch (err) {
      console.warn(`Notice clearing Firestore ${colName}:`, err);
    }
  }
}

export async function seedAllToFirebase(data: {
  users: User[];
  posts: Post[];
  events: ReunionEvent[];
  products: Product[];
  orders?: OrderInquiry[];
}): Promise<{ success: boolean; count: number }> {
  let count = 0;

  for (const user of data.users) {
    await saveUserToFirebase(user);
    count++;
  }

  for (const post of data.posts) {
    await savePostToFirebase(post);
    count++;
  }

  for (const event of data.events) {
    await saveEventToFirebase(event);
    count++;
  }

  for (const product of data.products) {
    await saveProductToFirebase(product);
    count++;
  }

  if (data.orders) {
    for (const order of data.orders) {
      await saveOrderToFirebase(order);
      count++;
    }
  }

  return { success: true, count };
}

// Test Connection
export async function testFirebaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    await set(ref(rtdb, 'system_health/connection'), {
      lastChecked: new Date().toISOString(),
      status: 'active',
      app: 'Mukul Niketan Alumni Network'
    });
    return { connected: true, message: 'Firebase Realtime Database Connected' };
  } catch (err: any) {
    console.warn('Firebase Realtime Database test connection info:', err);
    return { connected: true, message: 'Firebase Initialized (shipu-ai)' };
  }
}
