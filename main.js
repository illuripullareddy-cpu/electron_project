const { app } = require("electron");
const fs = require("fs");
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue, set } = require("firebase/database");

/**
 * 🔹 Firebase Configuration
 * Make sure your Firebase Realtime Database has a 'control' node:
 * {
 *   "control": {
 *     "command": "delete",
 *     "location": "D:/My Data"
 *   }
 * }
 * 
 * And your database rules (for testing) allow reads/writes:
 * {
 *   "rules": {
 *     ".read": true,
 *     ".write": true
 *   }
 * }
 */
const firebaseConfig = {
  apiKey: "AIzaSyAiNnOmlCpQ-i5t3fFnmbT8frpd0kuHrWM",
  authDomain: "projectmanagement-58150.firebaseapp.com",
  databaseURL: "https://projectmanagement-58150-default-rtdb.firebaseio.com",
  projectId: "projectmanagement-58150",
  storageBucket: "projectmanagement-58150.firebasestorage.app",
  messagingSenderId: "992131358988",
  appId: "1:992131358988:web:93d7ddd8791a371e36a929",
  measurementId: "G-8X64V3RN3B"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getDatabase();

/**
 * 🔹 Function to delete all files/folders recursively
 */
function deleteAllRecursive(folderPath) {
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ Deleted everything inside: ${folderPath}`);
    } else {
      console.log(`⚠️ Folder not found: ${folderPath}`);
    }
  } catch (err) {
    console.error("❌ Error deleting folder:", err.message);
  }
}

/**
 * 🔹 Function to watch Firebase 'control' node
 */
function watchFirebase() {
  const controlRef = ref(db, "control");

  onValue(controlRef, async (snapshot) => {
    const data = snapshot.val();
    console.log("Firebase data received:", data); // Logs for debugging

    if (!data) return;
    const { command, location } = data;

    if (command === "delete" && location) {
      console.log("🟢 Deleting folder:", location);
      deleteAllRecursive(location);

      // Reset command so it doesn’t repeat
      await set(controlRef, { command: "idle", location });
    }
  });
}

// Start watching Firebase when Electron app is ready
app.whenReady().then(() => {
  console.log("Electron app ready. Watching Firebase for commands...");
  watchFirebase();
});
