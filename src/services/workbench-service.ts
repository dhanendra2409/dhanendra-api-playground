
import { 
  collection, 
  addDoc, 
  Timestamp,
  Firestore,
  setDoc,
  doc
} from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export interface ApiRequest {
  id?: string;
  userId: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  response?: {
    status: number;
    statusText: string;
    time: string;
    size: string;
    headers: Record<string, string>;
    body: string;
  };
  timestamp: Timestamp;
  isFavorite?: boolean;
}

export interface Collection {
  id?: string;
  userId: string;
  name: string;
  requestCount: number;
}

const REQUESTS_COLLECTION = "requests";
const COLLECTIONS_COLLECTION = "collections";

export function saveRequestHistory(db: Firestore, request: Omit<ApiRequest, "timestamp">) {
  const collRef = collection(db, REQUESTS_COLLECTION);
  const data = {
    ...request,
    timestamp: Timestamp.now()
  };

  addDoc(collRef, data).catch(async (err) => {
    const permissionError = new FirestorePermissionError({
      path: REQUESTS_COLLECTION,
      operation: 'create',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function createCollection(db: Firestore, userId: string, name: string) {
  const collRef = collection(db, COLLECTIONS_COLLECTION);
  const data = {
    userId,
    name,
    requestCount: 0
  };

  addDoc(collRef, data).catch(async (err) => {
    const permissionError = new FirestorePermissionError({
      path: COLLECTIONS_COLLECTION,
      operation: 'create',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
