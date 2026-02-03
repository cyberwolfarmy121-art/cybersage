// Firebase Configuration for Karate Academy
// IMPORTANT: Replace with your own Firebase config from Firebase Console
// Go to https://console.firebase.google.com/ to create a project

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (only if config is set)
let firebaseApp = null;
let database = null;

if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.warn('Firebase initialization error:', error);
    }
} else if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn('Firebase config not set. Cross-device sync disabled.');
    console.warn('To enable: 1) Create a Firebase project at https://console.firebase.google.com/');
    console.warn('2) Enable Realtime Database');
    console.warn('3) Replace YOUR_API_KEY in firebase-config.js with your actual config');
}

// Get settings from localStorage
function getSettings() {
    const stored = localStorage.getItem('karateSettings');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        siteName: 'Karate Academy',
        logoImage: '',
        logoIcon: 'fas fa-fist-raised',
        contactAddress: '',
        contactPhone: '',
        contactEmail: '',
        contactHours: ''
    };
}

// Firebase helper functions
const firebaseSync = {
    // Check if Firebase is available
    isAvailable: () => database !== null,

    // Save data to Firebase
    save: async (path, data) => {
        if (database) {
            try {
                await database.ref(path).set(data);
                console.log('Saved to Firebase:', path);
                return true;
            } catch (error) {
                console.error('Firebase save error:', error);
                return false;
            }
        }
        return false;
    },

    // Listen for real-time updates
    listen: (path, callback) => {
        if (database) {
            const ref = database.ref(path);
            ref.on('value', (snapshot) => {
                callback(snapshot.val());
            });
            return () => ref.off();
        }
        return () => {};
    },

    // Push new data
    push: async (path, data) => {
        if (database) {
            try {
                const newRef = database.ref(path).push();
                await newRef.set(data);
                return newRef.key;
            } catch (error) {
                console.error('Firebase push error:', error);
                return null;
            }
        }
        return null;
    },

    // Update existing data
    update: async (path, data) => {
        if (database) {
            try {
                await database.ref(path).update(data);
                return true;
            } catch (error) {
                console.error('Firebase update error:', error);
                return false;
            }
        }
        return false;
    },

    // Remove data
    remove: async (path) => {
        if (database) {
            try {
                await database.ref(path).remove();
                return true;
            } catch (error) {
                console.error('Firebase remove error:', error);
                return false;
            }
        }
        return false;
    }
};

// Auto-sync all karate data between localStorage and Firebase
const autoSync = {
    syncInterval: null,
    
    start: () => {
        if (!firebaseSync.isAvailable()) return;
        
        // Sync to Firebase every 5 minutes
        autoSync.syncInterval = setInterval(() => {
            autoSync.saveAll();
        }, 300000); // 5 minutes
        
        console.log('Firebase auto-sync started');
    },
    
    stop: () => {
        if (autoSync.syncInterval) {
            clearInterval(autoSync.syncInterval);
        }
    },
    
    saveAll: () => {
        if (!firebaseSync.isAvailable()) return;
        
        // Save all data to Firebase
        const data = {
            videos: getVideos(),
            masters: getMasters(),
            champions: getChampions(),
            awarded: getAwarded(),
            features: getFeatures(),
            pricing: getPricing(),
            settings: getSettings(),
            paymentSessions: getPaymentSessions()
        };
        
        firebaseSync.save('karateApp', data);
        console.log('Auto-synced to Firebase');
    },
    
    loadAll: async () => {
        if (!firebaseSync.isAvailable()) return null;
        
        try {
            return await new Promise((resolve) => {
                firebaseSync.listen('karateApp', (data) => {
                    resolve(data);
                });
            });
        } catch (error) {
            console.error('Error loading from Firebase:', error);
            return null;
        }
    }
};

// Start auto-sync when page loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        if (firebaseSync.isAvailable()) {
            autoSync.start();
        }
    });
}
