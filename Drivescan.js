const { app } = require("electron");
const fs = require("fs");
const path = require("path");

// Firebase SDK imports
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");

// ✅ Your Firebase config
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

// ✅ Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);

// 📌 Function to scan folder recursively
function scanFolder(dirPath, results = [], limit = 200) {
  if (results.length >= limit) return results;

  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (results.length >= limit) break;

      const fullPath = path.join(dirPath, file);
      results.push(fullPath);

      if (fs.lstatSync(fullPath).isDirectory()) {
        scanFolder(fullPath, results, limit);
      }
    }
  } catch (err) {
    // Skip folders we cannot access
  }
  return results;
}

// 📌 Upload scan results to Firebase
function uploadToFirebase(fileList) {
  const dbRef = ref(db, "dDriveScan");
  set(dbRef, fileList)
    .then(() => {
      console.log("✅ Uploaded file list to Firebase!");
    })
    .catch((err) => {
      console.error("❌ Upload failed:", err);
    });
}

app.whenReady().then(() => {
  console.log("🚀 Scanning D:/ drive...");

  const scanResults = scanFolder("D:/", [], 200); // limit top 200
  console.log(`📂 Found ${scanResults.length} files/folders.`);

  uploadToFirebase(scanResults);
});

