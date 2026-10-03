import {
  db,
  auth,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  handleFirestoreError,
  OperationType,
} from '../firebase/config';
import { DocumentRecord, DonationRecord, AuditEvent, UserProfile } from '../types';

const DOCS_COLLECTION = 'documents';
const AUDIT_COLLECTION = 'audit_events';
const DONATIONS_COLLECTION = 'donations';
const USERS_COLLECTION = 'users';

/**
 * Persist or update authenticated user profile in Firestore
 */
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  organizationId?: string;
}): Promise<UserProfile> {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const profile: UserProfile = {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    role: (user.role as any) || 'HOLDER',
    organizationId: user.organizationId,
    avatarUrl: user.photoURL || undefined,
  };

  // Only sync to Firestore if user is authenticated with Firebase Auth
  if (!auth.currentUser) {
    return profile;
  }

  try {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: profile.role,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return profile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${user.uid}`);
  }
}

/**
 * Fetch all real documents from Firestore
 */
export async function fetchDocumentsFromFirestore(): Promise<DocumentRecord[]> {
  try {
    const q = query(collection(db, DOCS_COLLECTION), orderBy('issuedAt', 'desc'));
    const snapshot = await getDocs(q);
    const docs: DocumentRecord[] = [];
    snapshot.forEach(d => {
      docs.push(d.data() as DocumentRecord);
    });
    return docs;
  } catch (error) {
    // If empty or permission, handle gracefully
    try {
      const snapshot = await getDocs(collection(db, DOCS_COLLECTION));
      const docs: DocumentRecord[] = [];
      snapshot.forEach(d => {
        docs.push(d.data() as DocumentRecord);
      });
      return docs;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, DOCS_COLLECTION);
    }
  }
}

/**
 * Save a newly issued document into Firestore
 */
export async function saveDocumentToFirestore(document: DocumentRecord): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  try {
    // Save with custom documentId so it matches hash/record id
    await setDoc(doc(db, DOCS_COLLECTION, document.documentId), document);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${DOCS_COLLECTION}/${document.documentId}`);
  }
}

/**
 * Update document status (e.g. REVOKED or SUPERSEDED)
 */
export async function updateDocumentInFirestore(
  documentId: string,
  updates: Partial<DocumentRecord>
): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  try {
    const ref = doc(db, DOCS_COLLECTION, documentId);
    await updateDoc(ref, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${DOCS_COLLECTION}/${documentId}`);
  }
}

/**
 * Fetch all audit events from Firestore
 */
export async function fetchAuditEventsFromFirestore(): Promise<AuditEvent[]> {
  try {
    const q = query(collection(db, AUDIT_COLLECTION), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const events: AuditEvent[] = [];
    snapshot.forEach(d => {
      events.push(d.data() as AuditEvent);
    });
    return events;
  } catch (error) {
    try {
      const snapshot = await getDocs(collection(db, AUDIT_COLLECTION));
      const events: AuditEvent[] = [];
      snapshot.forEach(d => {
        events.push(d.data() as AuditEvent);
      });
      return events;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, AUDIT_COLLECTION);
    }
  }
}

/**
 * Record an audit event into Firestore
 */
export async function recordAuditEventInFirestore(event: AuditEvent): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  try {
    await setDoc(doc(db, AUDIT_COLLECTION, event.id), event);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${AUDIT_COLLECTION}/${event.id}`);
  }
}

/**
 * Fetch all donations from Firestore
 */
export async function fetchDonationsFromFirestore(): Promise<DonationRecord[]> {
  try {
    const q = query(collection(db, DONATIONS_COLLECTION), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const donations: DonationRecord[] = [];
    snapshot.forEach(d => {
      donations.push(d.data() as DonationRecord);
    });
    return donations;
  } catch (error) {
    try {
      const snapshot = await getDocs(collection(db, DONATIONS_COLLECTION));
      const donations: DonationRecord[] = [];
      snapshot.forEach(d => {
        donations.push(d.data() as DonationRecord);
      });
      return donations;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, DONATIONS_COLLECTION);
    }
  }
}

/**
 * Save donation to Firestore
 */
export async function saveDonationToFirestore(donation: DonationRecord): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  try {
    await setDoc(doc(db, DONATIONS_COLLECTION, donation.donationId), donation);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${DONATIONS_COLLECTION}/${donation.donationId}`);
  }
}
