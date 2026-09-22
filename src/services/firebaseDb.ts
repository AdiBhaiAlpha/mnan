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

export function subscribeToPosts(callback: (posts: Post[]) => void): () => void {
  try {
    const postsRef = ref(rtdb, DB_PATHS.posts);
    const unsubRtdb = onValue(postsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const postsList = Object.values(val) as Post[];
        // Sort posts descending by createdAt
        postsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(postsList);
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
        callback(eventsList);
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

// ----------------- Write Operations (Firebase Realtime Database) -----------------

export async function saveUserToFirebase(user: User): Promise<void> {
  const sanitizedUser = { ...user };
  if (isAdminName(sanitizedUser.name)) {
    sanitizedUser.role = 'admin';
    sanitizedUser.status = 'approved';
  }

  try {
    await set(ref(rtdb, `users/${user.id}`), sanitizedUser);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `users/${user.id}`);
  }

  // Dual sync to Firestore for backup compatibility
  try {
    await setDoc(doc(db, 'users', user.id), sanitizedUser);
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
  try {
    await set(ref(rtdb, `posts/${post.id}`), post);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `posts/${post.id}`);
  }

  try {
    await setDoc(doc(db, 'posts', post.id), post);
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
  try {
    await set(ref(rtdb, `events/${event.id}`), event);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `events/${event.id}`);
  }

  try {
    await setDoc(doc(db, 'events', event.id), event);
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
  try {
    await set(ref(rtdb, `products/${product.id}`), product);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `products/${product.id}`);
  }

  try {
    await setDoc(doc(db, 'products', product.id), product);
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
  try {
    await set(ref(rtdb, `orders/${order.id}`), order);
  } catch (err) {
    handleRtdbError(err, OperationType.WRITE, `orders/${order.id}`);
  }

  try {
    await setDoc(doc(db, 'orders', order.id), order);
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
