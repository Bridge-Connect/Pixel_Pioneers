import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only once
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize services
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

// Only connect to emulators in development and if not already connected
// Emulator connection (optional, uncomment if needed)
// if (process.env.NODE_ENV === "development") {
//   try {
//     if (!auth.config.emulator) {
//       // connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
//     }
//     if (!db._delegate._databaseId.projectId.includes("demo-")) {
//       // connectFirestoreEmulator(db, 'localhost', 8080)
//     }
//     if (!storage._location.bucket.includes("demo-")) {
//       // connectStorageEmulator(storage, 'localhost', 9199)
//     }
//   } catch (error) {
//     console.log("Emulators already connected or not available")
//   }
// }

export async function markLessonComplete(userId: string, lessonId: string) {
  try {
    const db = getFirestore();
    const progressRef = doc(db, "users", userId, "progress", "progress");
    await updateDoc(progressRef, { completedLessons: arrayUnion(lessonId) });
    console.log(`Marked lesson ${lessonId} as complete for user ${userId}`);
  } catch (error) {
    // If the document doesn't exist, create it with the lessonId
    const db = getFirestore();
    const progressRef = doc(db, "users", userId, "progress", "progress");
    // @ts-ignore
    if (error.code === "not-found" || (error.message && error.message.includes("No document to update"))) {
      await setDoc(progressRef, { completedLessons: [lessonId] });
      console.log(`Created progress doc and marked lesson ${lessonId} as complete for user ${userId}`);
    } else {
      console.error("Error marking lesson as complete:", error);
    }
  }
}

export async function getCompletedLessons(userId: string): Promise<string[]> {
  try {
    const db = getFirestore();
    const progressRef = doc(db, "users", userId, "progress", "progress");
    const progressSnap = await getDoc(progressRef);
    if (progressSnap.exists()) {
      const data = progressSnap.data();
      console.log("Fetched completedLessons:", data.completedLessons);
      return data.completedLessons || [];
    } else {
      console.log("No progress document found for user", userId);
      return [];
    }
  } catch (error) {
    console.error("Error fetching completed lessons:", error);
    return [];
  }
}

export { firebaseApp, auth, db, storage }
