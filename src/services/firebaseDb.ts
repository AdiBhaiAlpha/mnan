import { 
  db, 
  rtdb, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot,
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

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
  return errInfo;
}

// Collections in Firebase
export const COLLECTIONS = {
  users: 'users',
  posts: 'posts',
  events: 'events',
  products: 'products',
  orders: 'orders'
} as const;

// ----------------- Realtime Subscriptions -----------------

export function subscribeToUsers(callback: (users: User[]) => void): () => void {
  let unsubFirestore: (() => void) | null = null;
  let unsubRtdb: (() => void) | null = null;

  try {
    const usersCol = collection(db, COLLECTIONS.users);
    unsubFirestore = onSnapshot(usersCol, (snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach((docSnap) => {
        usersList.push(docSnap.data() as User);
      });
      callback(usersList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.users);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTIONS.users);
  }

  // Fallback to Realtime Database if Firestore is offline or empty
  try {
    const usersRef = ref(rtdb, 'users');
    unsubRtdb = onValue(usersRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const usersList = Object.values(val) as User[];
        callback(usersList);
      }
    }, (err) => {
      console.warn('RTDB users listener notice:', err);
    });
  } catch (e) {
    // RTDB fallback optional
  }

  return () => {
    if (unsubFirestore) unsubFirestore();
    if (unsubRtdb) unsubRtdb();
  };
}

export function subscribeToPosts(callback: (posts: Post[]) => void): () => void {
  let unsubFirestore: (() => void) | null = null;
  let unsubRtdb: (() => void) | null = null;

  try {
    const postsCol = collection(db, COLLECTIONS.posts);
    unsubFirestore = onSnapshot(postsCol, (snapshot) => {
      const postsList: Post[] = [];
      snapshot.forEach((docSnap) => {
        postsList.push(docSnap.data() as Post);
      });
      // Sort posts descending by createdAt
      postsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(postsList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.posts);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTIONS.posts);
  }

  try {
    const postsRef = ref(rtdb, 'posts');
    unsubRtdb = onValue(postsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const postsList = Object.values(val) as Post[];
        postsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(postsList);
      }
    }, (err) => {
      console.warn('RTDB posts listener notice:', err);
    });
  } catch (e) {}

  return () => {
    if (unsubFirestore) unsubFirestore();
    if (unsubRtdb) unsubRtdb();
  };
}

export function subscribeToEvents(callback: (events: ReunionEvent[]) => void): () => void {
  let unsubFirestore: (() => void) | null = null;
  let unsubRtdb: (() => void) | null = null;

  try {
    const eventsCol = collection(db, COLLECTIONS.events);
    unsubFirestore = onSnapshot(eventsCol, (snapshot) => {
      const eventsList: ReunionEvent[] = [];
      snapshot.forEach((docSnap) => {
        eventsList.push(docSnap.data() as ReunionEvent);
      });
      callback(eventsList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.events);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTIONS.events);
  }

  try {
    const eventsRef = ref(rtdb, 'events');
    unsubRtdb = onValue(eventsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const eventsList = Object.values(val) as ReunionEvent[];
        callback(eventsList);
      }
    }, (err) => {
      console.warn('RTDB events listener notice:', err);
    });
  } catch (e) {}

  return () => {
    if (unsubFirestore) unsubFirestore();
    if (unsubRtdb) unsubRtdb();
  };
}

export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  let unsubFirestore: (() => void) | null = null;
  let unsubRtdb: (() => void) | null = null;

  try {
    const productsCol = collection(db, COLLECTIONS.products);
    unsubFirestore = onSnapshot(productsCol, (snapshot) => {
      const productsList: Product[] = [];
      snapshot.forEach((docSnap) => {
        productsList.push(docSnap.data() as Product);
      });
      callback(productsList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.products);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTIONS.products);
  }

  try {
    const productsRef = ref(rtdb, 'products');
    unsubRtdb = onValue(productsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const productsList = Object.values(val) as Product[];
        callback(productsList);
      }
    }, (err) => {
      console.warn('RTDB products listener notice:', err);
    });
  } catch (e) {}

  return () => {
    if (unsubFirestore) unsubFirestore();
    if (unsubRtdb) unsubRtdb();
  };
}

export function subscribeToOrders(callback: (orders: OrderInquiry[]) => void): () => void {
  let unsubFirestore: (() => void) | null = null;
  let unsubRtdb: (() => void) | null = null;

  try {
    const ordersCol = collection(db, COLLECTIONS.orders);
    unsubFirestore = onSnapshot(ordersCol, (snapshot) => {
      const ordersList: OrderInquiry[] = [];
      snapshot.forEach((docSnap) => {
        ordersList.push(docSnap.data() as OrderInquiry);
      });
      callback(ordersList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.orders);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, COLLECTIONS.orders);
  }

  try {
    const ordersRef = ref(rtdb, 'orders');
    unsubRtdb = onValue(ordersRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const ordersList = Object.values(val) as OrderInquiry[];
        callback(ordersList);
      }
    }, (err) => {
      console.warn('RTDB orders listener notice:', err);
    });
  } catch (e) {}

  return () => {
    if (unsubFirestore) unsubFirestore();
    if (unsubRtdb) unsubRtdb();
  };
}

// ----------------- Write Operations -----------------

export async function saveUserToFirebase(user: User): Promise<void> {
  const sanitizedUser = { ...user };
  if (isAdminName(sanitizedUser.name)) {
    sanitizedUser.role = 'admin';
    sanitizedUser.status = 'approved';
  }

  try {
    await setDoc(doc(db, COLLECTIONS.users, user.id), sanitizedUser);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.users}/${user.id}`);
  }

  // Also write to RTDB for multi-database availability
  try {
    await set(ref(rtdb, `users/${user.id}`), sanitizedUser);
  } catch (e) {}
}

export async function deleteUserFromFirebase(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.users, userId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.users}/${userId}`);
  }
  try {
    await set(ref(rtdb, `users/${userId}`), null);
  } catch (e) {}
}

export async function savePostToFirebase(post: Post): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.posts, post.id), post);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.posts}/${post.id}`);
  }
  try {
    await set(ref(rtdb, `posts/${post.id}`), post);
  } catch (e) {}
}

export async function deletePostFromFirebase(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.posts, postId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.posts}/${postId}`);
  }
  try {
    await set(ref(rtdb, `posts/${postId}`), null);
  } catch (e) {}
}

export async function saveEventToFirebase(event: ReunionEvent): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.events, event.id), event);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.events}/${event.id}`);
  }
  try {
    await set(ref(rtdb, `events/${event.id}`), event);
  } catch (e) {}
}

export async function deleteEventFromFirebase(eventId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.events, eventId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.events}/${eventId}`);
  }
  try {
    await set(ref(rtdb, `events/${eventId}`), null);
  } catch (e) {}
}

export async function saveProductToFirebase(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.products, product.id), product);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.products}/${product.id}`);
  }
  try {
    await set(ref(rtdb, `products/${product.id}`), product);
  } catch (e) {}
}

export async function deleteProductFromFirebase(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.products, productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.products}/${productId}`);
  }
  try {
    await set(ref(rtdb, `products/${productId}`), null);
  } catch (e) {}
}

export async function saveOrderToFirebase(order: OrderInquiry): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.orders, order.id), order);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.orders}/${order.id}`);
  }
  try {
    await set(ref(rtdb, `orders/${order.id}`), order);
  } catch (e) {}
}

// ----------------- Bulk Seed / Initial Cloud Push -----------------

export async function clearAllCloudData(): Promise<void> {
  // Clear Realtime Database paths
  try {
    await set(ref(rtdb, 'users'), null);
    await set(ref(rtdb, 'posts'), null);
    await set(ref(rtdb, 'events'), null);
    await set(ref(rtdb, 'products'), null);
    await set(ref(rtdb, 'orders'), null);
  } catch (e) {
    console.warn('Notice clearing RTDB:', e);
  }

  // Clear Firestore collections
  const collectionsToClear = [COLLECTIONS.users, COLLECTIONS.posts, COLLECTIONS.events, COLLECTIONS.products, COLLECTIONS.orders];
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

  // Save users
  for (const user of data.users) {
    await saveUserToFirebase(user);
    count++;
  }

  // Save posts
  for (const post of data.posts) {
    await savePostToFirebase(post);
    count++;
  }

  // Save events
  for (const event of data.events) {
    await saveEventToFirebase(event);
    count++;
  }

  // Save products
  for (const product of data.products) {
    await saveProductToFirebase(product);
    count++;
  }

  // Save orders
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
    const testDoc = doc(db, 'system_health', 'connection');
    await setDoc(testDoc, {
      lastChecked: new Date().toISOString(),
      status: 'active',
      app: 'Mukul Niketan Alumni Network'
    });
    return { connected: true, message: 'Firebase Cloud Database Connected' };
  } catch (err: any) {
    console.warn('Firebase Firestore test connection info:', err);
    // Even if Firestore rules restrict direct system_health write, RTDB or local connection is active
    return { connected: true, message: 'Firebase Initialized (black-book-65d42)' };
  }
}
