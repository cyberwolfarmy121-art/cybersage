// Admin Panel JavaScript

// Firebase configuration (load from external file if available)
let firebaseSync = window.firebaseSync || {
    isAvailable: () => false,
    save: async () => false,
    listen: () => () => {}
};

// Default videos data
const defaultVideos = [
    // Kata Videos
    { id: 1, title: 'Shotokan Kata - Taikyoku Shodan', category: 'kata', duration: '3:45', level: 'free', description: 'Foundation kata for white belts' },
    { id: 2, title: 'Shotokan Kata - Heian Shodan', category: 'kata', duration: '4:20', level: 'free', description: 'Peaceful mind - first of the five Heian katas' },
    { id: 3, title: 'Shotokan Kata - Heian Nidan', category: 'kata', duration: '5:30', level: 'locked', description: 'Peaceful mind - second Heian kata' },
    { id: 4, title: 'Shotokan Kata - Bassai Dai', category: 'kata', duration: '6:15', level: 'locked', description: 'Penetrate the fortress - advanced kata' },
    // Beginner Videos
    { id: 5, title: 'Basic Stances - Zenkutsu Dachi', category: 'beginner', duration: '2:30', level: 'free', description: 'Forward stance fundamentals' },
    { id: 6, title: 'Punch Technique - Gyaku Tsuki', category: 'beginner', duration: '3:00', level: 'free', description: 'Reverse punch execution' },
    { id: 7, title: 'Kick Technique - Mae Geri', category: 'beginner', duration: '3:15', level: 'locked', description: 'Front kick fundamentals' },
    { id: 8, title: 'Block Techniques - Age Uke & Soto Uke', category: 'beginner', duration: '4:00', level: 'locked', description: 'Inside and outside block techniques' },
    // Kumite Videos
    { id: 9, title: 'Ippon Kumite - One Point Sparring', category: 'kumite', duration: '5:00', level: 'locked', description: 'Controlled partner drills for beginners' },
    { id: 10, title: 'Sanbon Kumite - Three Step Sparring', category: 'kumite', duration: '6:30', level: 'locked', description: 'Progressive sparring drills' },
    { id: 11, title: 'Jiyu Kumite - Free Sparring', category: 'kumite', duration: '8:00', level: 'locked', description: 'Open sparring for advanced students' },
    { id: 12, title: 'Competition Kumite Techniques', category: 'kumite', duration: '10:00', level: 'locked', description: 'Match strategies and timing' }
];

// Default masters data
const defaultMasters = [
    { id: 1, name: 'Sensei John Smith', subtitle: '8th Dan Black Belt', tag: 'Head Instructor' },
    { id: 2, name: 'Sensei Maria Garcia', subtitle: '6th Dan Black Belt', tag: 'Senior Instructor' },
    { id: 3, name: 'Sensei David Lee', subtitle: '5th Dan Black Belt', tag: 'Competition Coach' }
];

// Default champions data
const defaultChampions = [
    { id: 1, name: 'Alex Johnson', subtitle: 'National Champion 2023', tag: 'Kata - Black Belt Division', medal: 'gold' },
    { id: 2, name: 'Sarah Williams', subtitle: 'Regional Champion 2023', tag: 'Kumite - Heavyweight', medal: 'silver' },
    { id: 3, name: 'Michael Chen', subtitle: 'State Champion 2023', tag: 'Kata - Youth Division', medal: 'bronze' }
];

// Default awarded data
const defaultAwarded = [
    { id: 1, name: 'Lifetime Achievement Award', subtitle: 'Awarded to Sensei John Smith', tag: '2023' },
    { id: 2, name: 'Excellence in Teaching', subtitle: 'Awarded to Sensei Maria Garcia', tag: '2022' },
    { id: 3, name: 'Coach of the Year', subtitle: 'Awarded to Sensei David Lee', tag: '2023' }
];

// Initialize or get videos from localStorage
function getVideos() {
    const stored = localStorage.getItem('karateVideos');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('karateVideos', JSON.stringify(defaultVideos));
    return defaultVideos;
}

// Initialize or get masters from localStorage
function getMasters() {
    const stored = localStorage.getItem('karateMasters');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('karateMasters', JSON.stringify(defaultMasters));
    return defaultMasters;
}

// Initialize or get champions from localStorage
function getChampions() {
    const stored = localStorage.getItem('karateChampions');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('karateChampions', JSON.stringify(defaultChampions));
    return defaultChampions;
}

// Initialize or get awarded from localStorage
function getAwarded() {
    const stored = localStorage.getItem('karateAwarded');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('karateAwarded', JSON.stringify(defaultAwarded));
    return defaultAwarded;
}

// Initialize or get members from localStorage
function getMembers() {
    const stored = localStorage.getItem('karateMembers');
    return stored ? JSON.parse(stored) : [];
}

// Initialize or get features from localStorage
function getFeatures() {
    const stored = localStorage.getItem('karateFeatures');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default features structure
    const defaultFeatures = {
        beginner: [
            { id: 1, text: 'Basic training videos', enabled: true },
            { id: 2, text: 'Beginner kata tutorials', enabled: true },
            { id: 3, text: 'Community access', enabled: true }
        ],
        advanced: [
            { id: 1, text: 'All Beginner features', enabled: true },
            { id: 2, text: 'Advanced kata training', enabled: true },
            { id: 3, text: 'Kumite techniques', enabled: true },
            { id: 4, text: 'Priority support', enabled: true }
        ],
        elite: [
            { id: 1, text: 'All Advanced features', enabled: true },
            { id: 2, text: '1-on-1 coaching sessions', enabled: true },
            { id: 3, text: 'Exclusive content', enabled: true },
            { id: 4, text: 'Personalized training plan', enabled: true }
        ]
    };
    localStorage.setItem('karateFeatures', JSON.stringify(defaultFeatures));
    return defaultFeatures;
}

// Save features to localStorage
function saveFeatures(features) {
    localStorage.setItem('karateFeatures', JSON.stringify(features));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/features', features);
    }
}

// Load features into the UI
function loadFeaturesUI() {
    const features = getFeatures();
    
    ['beginner', 'advanced', 'elite'].forEach(plan => {
        const container = document.getElementById(plan + 'FeaturesList');
        if (container) {
            container.innerHTML = '';
            features[plan].forEach((feature, index) => {
                const featureEl = document.createElement('div');
                featureEl.className = 'feature-item' + (feature.enabled ? '' : ' disabled');
                featureEl.innerHTML = `
                    <div class="feature-toggle ${feature.enabled ? 'active' : ''}" onclick="toggleFeature('${plan}', ${index})"></div>
                    <input type="text" class="feature-text" value="${feature.text}" onchange="editFeature('${plan}', ${index}, this.value)">
                    <button class="feature-delete" onclick="deleteFeature('${plan}', ${index})"><i class="fas fa-trash"></i></button>
                `;
                container.appendChild(featureEl);
            });
        }
    });
}

// Toggle feature on/off
function toggleFeature(plan, index) {
    const features = getFeatures();
    features[plan][index].enabled = !features[plan][index].enabled;
    saveFeatures(features);
    loadFeaturesUI();
}

// Edit feature text
function editFeature(plan, index, newText) {
    const features = getFeatures();
    features[plan][index].text = newText;
    saveFeatures(features);
}

// Delete feature
function deleteFeature(plan, index) {
    const features = getFeatures();
    features[plan].splice(index, 1);
    saveFeatures(features);
    loadFeaturesUI();
}

// Add new feature
function addFeature(plan) {
    const input = document.getElementById(plan + 'NewFeature');
    const newFeature = input.value.trim();
    
    if (newFeature) {
        const features = getFeatures();
        features[plan].push({
            id: Date.now(),
            text: newFeature,
            enabled: true
        });
        saveFeatures(features);
        input.value = '';
        loadFeaturesUI();
    }
}

// Get features as text array for pricing
function getFeaturesAsText(plan) {
    const features = getFeatures();
    return features[plan].filter(f => f.enabled).map(f => f.text);
}

// Set features from text array
function setFeaturesFromText(plan, textArray) {
    const features = getFeatures();
    features[plan] = textArray.map((text, index) => ({
        id: Date.now() + index,
        text: text,
        enabled: true
    }));
    saveFeatures(features);
}

// Save members to localStorage
function saveMembers(members) {
    localStorage.setItem('karateMembers', JSON.stringify(members));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/members', members);
    }
}

// Save functions
function saveVideos(videos) {
    localStorage.setItem('karateVideos', JSON.stringify(videos));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/videos', videos);
    }
}

function saveMasters(masters) {
    localStorage.setItem('karateMasters', JSON.stringify(masters));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/masters', masters);
    }
}

function saveChampions(champions) {
    localStorage.setItem('karateChampions', JSON.stringify(champions));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/champions', champions);
    }
}

function saveAwarded(awarded) {
    localStorage.setItem('karateAwarded', JSON.stringify(awarded));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/awarded', awarded);
    }
}

// Admin credentials
const ADMIN_USER = 'KK';
const ADMIN_PASS = 'KK';

// Check if already logged in
if (localStorage.getItem('adminLoggedIn') === 'true') {
    showAdminPanel();
}

// Setup login form immediately (script is at end of body)
(function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('loginError');
            
            if (username === ADMIN_USER && password === ADMIN_PASS) {
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
                if (errorEl) errorEl.textContent = '';
            } else {
                if (errorEl) errorEl.textContent = 'Invalid username or password';
            }
        });
    }
})();

// Inline login handler for form onsubmit
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');
    
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        if (errorEl) errorEl.textContent = '';
    } else {
        if (errorEl) errorEl.textContent = 'Invalid username or password';
    }
}

// Show Admin Panel
function showAdminPanel() {
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    if (loginSection) loginSection.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    loadVideos();
    loadMembers();
    loadMasters();
    loadChampions();
    loadAwarded();
    loadSettings();
    loadPricing();
    loadPaymentSessions();
}

// Logout
function logout() {
    localStorage.removeItem('adminLoggedIn');
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    if (loginSection) loginSection.style.display = 'flex';
    if (adminPanel) adminPanel.style.display = 'none';
    if (loginForm) loginForm.reset();
}

// Show Admin Section
function showAdminSection(section) {
    document.querySelectorAll('.admin-section').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.admin-tab').forEach(el => {
        el.classList.remove('active');
    });
    
    const sectionEl = document.getElementById('admin' + capitalizeFirst(section));
    if (sectionEl) {
        sectionEl.style.display = 'block';
        if (event && event.target) {
            event.target.classList.add('active');
        }
    }
    
    if (section === 'settings') {
        loadSettings();
    } else if (section === 'pricing') {
        loadPricing();
    } else if (section === 'payment') {
        loadPaymentSessions();
    }
}

// Load and Display Videos
function loadVideos(filter = 'all') {
    const videos = getVideos();
    const container = document.getElementById('videoList');
    
    let filteredVideos = videos;
    if (filter !== 'all') {
        filteredVideos = videos.filter(v => v.category === filter);
    }
    
    // Update stats
    const totalEl = document.getElementById('totalVideos');
    const freeEl = document.getElementById('freeVideos');
    const lockedEl = document.getElementById('lockedVideos');
    if (totalEl) totalEl.textContent = videos.length;
    if (freeEl) freeEl.textContent = videos.filter(v => v.level === 'free').length;
    if (lockedEl) lockedEl.textContent = videos.filter(v => v.level === 'locked').length;
    
    if (!container) return;
    
    if (filteredVideos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-video"></i>
                <p>No videos found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredVideos.map(video => `
        <div class="video-item" data-id="${video.id}">
            <div class="video-item-header">
                <h4>${video.title}</h4>
                <span class="video-item-badge ${video.level}">${video.level === 'free' ? 'Free' : 'Locked'}</span>
            </div>
            <div class="video-item-body">
                <div class="video-item-meta">
                    <span><i class="fas fa-clock"></i> ${video.duration}</span>
                    <span><i class="fas fa-tag"></i> ${capitalizeFirst(video.category)}</span>
                </div>
                <p class="video-item-desc">${video.description}</p>
                <div class="video-item-actions">
                    <button class="btn-edit" onclick="editVideo(${video.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteVideoPrompt(${video.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Videos
function filterVideos(category) {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    loadVideos(category);
}

// Load Masters
function loadMasters() {
    const masters = getMasters();
    const container = document.getElementById('mastersList');
    
    if (!container) return;
    
    if (masters.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-tie"></i>
                <p>No masters added yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = masters.map(master => `
        <div class="video-item" data-id="${master.id}">
            <div class="video-item-header">
                <h4>${master.name}</h4>
                <span class="video-item-badge free">Master</span>
            </div>
            <div class="video-item-body">
                <p class="video-item-desc">${master.subtitle}</p>
                <span class="gallery-role" style="display: inline-block; padding: 0.3rem 0.8rem; background: var(--primary-color); color: white; border-radius: 20px; font-size: 0.8rem; margin-bottom: 0.5rem;">${master.tag}</span>
                <div class="video-item-actions">
                    <button class="btn-edit" onclick="editGallery(${master.id}, 'masters')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteGalleryPrompt(${master.id}, 'masters')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Champions
function loadChampions() {
    const champions = getChampions();
    const container = document.getElementById('championsList');
    
    if (!container) return;
    
    if (champions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy"></i>
                <p>No champions added yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = champions.map(champion => `
        <div class="video-item" data-id="${champion.id}">
            <div class="video-item-header">
                <h4>${champion.name}</h4>
                <span class="video-item-badge ${champion.medal === 'gold' ? 'free' : champion.medal === 'silver' ? 'locked' : 'locked'}">${capitalizeFirst(champion.medal)}</span>
            </div>
            <div class="video-item-body">
                <p class="video-item-desc">${champion.subtitle}</p>
                <span class="gallery-category" style="display: inline-block; padding: 0.3rem 0.8rem; background: var(--accent-color); color: white; border-radius: 20px; font-size: 0.8rem; margin-bottom: 0.5rem;">${champion.tag}</span>
                <div class="video-item-actions">
                    <button class="btn-edit" onclick="editGallery(${champion.id}, 'champions')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteGalleryPrompt(${champion.id}, 'champions')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Awarded
function loadAwarded() {
    const awarded = getAwarded();
    const container = document.getElementById('awardedList');
    
    if (!container) return;
    
    if (awarded.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-certificate"></i>
                <p>No awards added yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = awarded.map(award => `
        <div class="video-item" data-id="${award.id}">
            <div class="video-item-header">
                <h4>${award.name}</h4>
                <span class="video-item-badge free">Award</span>
            </div>
            <div class="video-item-body">
                <p class="video-item-desc">${award.subtitle}</p>
                <span style="display: inline-block; padding: 0.3rem 0.8rem; background: rgba(255,255,255,0.2); color: white; border-radius: 20px; font-size: 0.8rem; margin-bottom: 0.5rem;">${award.tag}</span>
                <div class="video-item-actions">
                    <button class="btn-edit" onclick="editGallery(${award.id}, 'awarded')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteGalleryPrompt(${award.id}, 'awarded')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Members
function loadMembers(filter = 'all') {
    const members = getMembers();
    const container = document.getElementById('membersList');
    
    // Update stats
    const totalEl = document.getElementById('totalMembers');
    const beginnerEl = document.getElementById('beginnerMembers');
    const advancedEl = document.getElementById('advancedMembers');
    const eliteEl = document.getElementById('eliteMembers');
    if (totalEl) totalEl.textContent = members.length;
    if (beginnerEl) beginnerEl.textContent = members.filter(m => m.plan === 'beginner').length;
    if (advancedEl) advancedEl.textContent = members.filter(m => m.plan === 'advanced').length;
    if (eliteEl) eliteEl.textContent = members.filter(m => m.plan === 'elite').length;
    
    let filteredMembers = members;
    if (filter !== 'all') {
        filteredMembers = members.filter(m => m.plan === filter);
    }
    
    if (!container) return;
    
    if (filteredMembers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>No members found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredMembers.map(member => `
        <div class="video-item" data-id="${member.id}">
            <div class="video-item-header">
                <h4>${member.name}</h4>
                <span class="video-item-badge ${member.plan === 'elite' ? 'free' : member.plan === 'advanced' ? 'locked' : 'free'}">${capitalizeFirst(member.plan)}</span>
            </div>
            <div class="video-item-body">
                <div class="video-item-meta">
                    <span><i class="fas fa-envelope"></i> ${member.email}</span>
                    <span><i class="fas fa-phone"></i> ${member.phone || 'N/A'}</span>
                </div>
                <div class="video-item-actions">
                    <button class="btn-edit" onclick="viewMember(${member.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-delete" onclick="deleteMemberPrompt(${member.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add Video
function addVideo() {
    const title = document.getElementById('newVideoTitle').value;
    const category = document.getElementById('newVideoCategory').value;
    const duration = document.getElementById('newVideoDuration').value;
    const level = document.getElementById('newVideoLevel').value;
    const description = document.getElementById('newVideoDescription').value;
    
    if (!title || !category || !duration) {
        alert('Please fill in all required fields');
        return;
    }
    
    const videos = getVideos();
    const newVideo = {
        id: Date.now(),
        title: title,
        category: category,
        duration: duration,
        level: level,
        description: description
    };
    
    videos.push(newVideo);
    saveVideos(videos);
    loadVideos();
    
    // Clear form
    document.getElementById('newVideoTitle').value = '';
    document.getElementById('newVideoCategory').value = '';
    document.getElementById('newVideoDuration').value = '';
    document.getElementById('newVideoLevel').value = 'free';
    document.getElementById('newVideoDescription').value = '';
    
    alert('Video added successfully!');
}

// Edit Video
function editVideo(id) {
    const videos = getVideos();
    const video = videos.find(v => v.id === id);
    
    if (!video) return;
    
    const newTitle = prompt('Edit Title:', video.title);
    if (newTitle === null) return;
    
    const newCategory = prompt('Edit Category (kata, beginner, kumite):', video.category);
    if (newCategory === null) return;
    
    const newDuration = prompt('Edit Duration (e.g., 3:45):', video.duration);
    if (newDuration === null) return;
    
    const newLevel = confirm('Click OK for "Locked" (Members Only), Cancel for "Free"') ? 'locked' : 'free';
    
    const newDescription = prompt('Edit Description:', video.description);
    
    video.title = newTitle || video.title;
    video.category = newCategory || video.category;
    video.duration = newDuration || video.duration;
    video.level = newLevel;
    video.description = newDescription !== null ? newDescription : video.description;
    
    saveVideos(videos);
    loadVideos();
    alert('Video updated successfully!');
}

// Delete Video
function deleteVideoPrompt(id) {
    if (confirm('Are you sure you want to delete this video?')) {
        let videos = getVideos();
        videos = videos.filter(v => v.id !== id);
        saveVideos(videos);
        loadVideos();
        alert('Video deleted successfully!');
    }
}

// Add Gallery Item (Master, Champion, Award)
function addGalleryItem(type) {
    const name = document.getElementById('new' + capitalizeFirst(type) + 'Name').value;
    const subtitle = document.getElementById('new' + capitalizeFirst(type) + 'Subtitle').value;
    const tag = document.getElementById('new' + capitalizeFirst(type) + 'Tag').value;
    const medal = type === 'champions' ? document.getElementById('newChampionMedal').value : null;
    
    if (!name) {
        alert('Please enter a name');
        return;
    }
    
    let items;
    switch(type) {
        case 'masters':
            items = getMasters();
            items.push({ id: Date.now(), name: name, subtitle: subtitle, tag: tag || 'Master' });
            saveMasters(items);
            break;
        case 'champions':
            items = getChampions();
            items.push({ id: Date.now(), name: name, subtitle: subtitle, tag: tag || 'Champion', medal: medal || 'gold' });
            saveChampions(items);
            break;
        case 'awarded':
            items = getAwarded();
            items.push({ id: Date.now(), name: name, subtitle: subtitle, tag: tag || 'Award' });
            saveAwarded(items);
            break;
    }
    
    loadGallery(type);
    
    // Clear form
    document.getElementById('new' + capitalizeFirst(type) + 'Name').value = '';
    document.getElementById('new' + capitalizeFirst(type) + 'Subtitle').value = '';
    document.getElementById('new' + capitalizeFirst(type) + 'Tag').value = '';
    if (type === 'champions') {
        document.getElementById('newChampionMedal').value = 'gold';
    }
    
    alert(capitalizeFirst(type) + ' added successfully!');
}

// Edit Gallery Item
function editGallery(id, type) {
    let items, item;
    switch(type) {
        case 'masters':
            items = getMasters();
            item = items.find(i => i.id === id);
            if (item) {
                const newName = prompt('Edit Name:', item.name);
                if (newName !== null) {
                    item.name = newName;
                    const newSubtitle = prompt('Edit Subtitle:', item.subtitle);
                    if (newSubtitle !== null) item.subtitle = newSubtitle;
                    const newTag = prompt('Edit Tag:', item.tag);
                    if (newTag !== null) item.tag = newTag;
                    saveMasters(items);
                    loadGallery(type);
                }
            }
            break;
        case 'champions':
            items = getChampions();
            item = items.find(i => i.id === id);
            if (item) {
                const newName = prompt('Edit Name:', item.name);
                if (newName !== null) {
                    item.name = newName;
                    const newSubtitle = prompt('Edit Subtitle:', item.subtitle);
                    if (newSubtitle !== null) item.subtitle = newSubtitle;
                    const newTag = prompt('Edit Tag:', item.tag);
                    if (newTag !== null) item.tag = newTag;
                    const newMedal = prompt('Edit Medal (gold, silver, bronze):', item.medal);
                    if (newMedal !== null) item.medal = newMedal;
                    saveChampions(items);
                    loadGallery(type);
                }
            }
            break;
        case 'awarded':
            items = getAwarded();
            item = items.find(i => i.id === id);
            if (item) {
                const newName = prompt('Edit Name:', item.name);
                if (newName !== null) {
                    item.name = newName;
                    const newSubtitle = prompt('Edit Subtitle:', item.subtitle);
                    if (newSubtitle !== null) item.subtitle = newSubtitle;
                    const newTag = prompt('Edit Year:', item.tag);
                    if (newTag !== null) item.tag = newTag;
                    saveAwarded(items);
                    loadGallery(type);
                }
            }
            break;
    }
}

// Delete Gallery Item
function deleteGalleryPrompt(id, type) {
    if (confirm('Are you sure you want to delete this ' + type.slice(0, -1) + '?')) {
        switch(type) {
            case 'masters':
                let masters = getMasters();
                masters = masters.filter(m => m.id !== id);
                saveMasters(masters);
                loadGallery(type);
                break;
            case 'champions':
                let champions = getChampions();
                champions = champions.filter(c => c.id !== id);
                saveChampions(champions);
                loadGallery(type);
                break;
            case 'awarded':
                let awarded = getAwarded();
                awarded = awarded.filter(a => a.id !== id);
                saveAwarded(awarded);
                loadGallery(type);
                break;
        }
        alert(capitalizeFirst(type.slice(0, -1)) + ' deleted successfully!');
    }
}

// View Member Details
function viewMember(id) {
    const members = getMembers();
    const member = members.find(m => m.id === id);
    
    if (!member) return;
    
    alert(`Member Details:\n\nName: ${member.name}\nEmail: ${member.email}\nPhone: ${member.phone || 'N/A'}\nPlan: ${capitalizeFirst(member.plan)}\nJoin Date: ${member.joinDate}\nStatus: ${capitalizeFirst(member.status)}`);
}

// Delete Member
function deleteMemberPrompt(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        let members = getMembers();
        members = members.filter(m => m.id !== id);
        saveMembers(members);
        loadMembers();
        alert('Member deleted successfully!');
    }
}

// Filter Members
function filterMembers(plan) {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    loadMembers(plan);
}

// Load Gallery
function loadGallery(type) {
    switch(type) {
        case 'masters':
            loadMasters();
            break;
        case 'champions':
            loadChampions();
            break;
        case 'awarded':
            loadAwarded();
            break;
    }
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Settings Management
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

function saveSettings(settings) {
    localStorage.setItem('karateSettings', JSON.stringify(settings));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/settings', settings);
    }
}

function loadSettings() {
    const settings = getSettings();
    
    const siteNameInput = document.getElementById('siteName');
    const logoImageInput = document.getElementById('logoImage');
    const contactAddressInput = document.getElementById('contactAddress');
    const contactPhoneInput = document.getElementById('contactPhone');
    const contactEmailInput = document.getElementById('contactEmail');
    const contactHoursInput = document.getElementById('contactHours');
    const logoPreview = document.getElementById('logoPreview');
    
    if (siteNameInput) siteNameInput.value = settings.siteName || '';
    if (logoImageInput) logoImageInput.value = settings.logoImage || '';
    if (contactAddressInput) contactAddressInput.value = settings.contactAddress || '';
    if (contactPhoneInput) contactPhoneInput.value = settings.contactPhone || '';
    if (contactEmailInput) contactEmailInput.value = settings.contactEmail || '';
    if (contactHoursInput) contactHoursInput.value = settings.contactHours || '';
    
    if (logoPreview && settings.logoImage) {
        logoPreview.innerHTML = `<img src="${settings.logoImage}" alt="Logo" style="max-width: 200px; max-height: 100px;">`;
    }
    
    updateSiteLogo(settings);
}

function updateSiteLogo(settings) {
    const navBrandText = document.querySelector('.nav-brand span');
    const navBrandIcon = document.querySelector('.nav-brand i');
    const navLogoImage = document.getElementById('adminNavLogoImage');
    
    if (navBrandText && settings.siteName) {
        navBrandText.textContent = 'Admin Panel - ' + settings.siteName;
    }
    
    if (navLogoImage && settings.logoImage) {
        navLogoImage.src = settings.logoImage;
        navLogoImage.style.display = 'block';
        if (navBrandIcon) {
            navBrandIcon.style.display = 'none';
        }
    } else if (navBrandIcon && settings.logoIcon) {
        navBrandIcon.className = settings.logoIcon;
    }
}

function saveAllSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        logoImage: document.getElementById('logoImage').value || '',
        logoIcon: 'fas fa-fist-raised',
        contactAddress: document.getElementById('contactAddress').value,
        contactPhone: document.getElementById('contactPhone').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactHours: document.getElementById('contactHours').value
    };
    
    saveSettings(settings);
    alert('Settings saved successfully!');
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoImageInput = document.getElementById('logoImage');
            const logoPreview = document.getElementById('logoPreview');
            
            if (logoImageInput) {
                logoImageInput.value = e.target.result;
            }
            if (logoPreview) {
                logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo" style="max-width: 200px; max-height: 100px;">`;
            }
            
            const settings = getSettings();
            settings.logoImage = e.target.result;
            saveSettings(settings);
            updateSiteLogo(settings);
        };
        reader.readAsDataURL(file);
    }
}

function clearLogo() {
    const logoImageInput = document.getElementById('logoImage');
    const logoPreview = document.getElementById('logoPreview');
    
    if (logoImageInput) logoImageInput.value = '';
    if (logoPreview) logoPreview.innerHTML = '';
    
    const settings = getSettings();
    settings.logoImage = '';
    saveSettings(settings);
    updateSiteLogo(settings);
}

// Pricing Management
function getPricing() {
    const stored = localStorage.getItem('karatePricing');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        beginner: { price: 49, discount: 0, features: ['Basic training videos', 'Beginner kata tutorials', 'Community access'] },
        advanced: { price: 89, discount: 0, features: ['All Beginner features', 'Advanced kata training', 'Kumite techniques', 'Priority support'] },
        elite: { price: 149, discount: 0, features: ['All Advanced features', '1-on-1 coaching sessions', 'Exclusive content', 'Personalized training plan'] }
    };
}

function savePricing(pricing) {
    localStorage.setItem('karatePricing', JSON.stringify(pricing));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/pricing', pricing);
    }
}

function loadPricing() {
    const pricing = getPricing();
    
    const beginnerPrice = document.getElementById('beginnerPrice');
    const beginnerDiscount = document.getElementById('beginnerDiscount');
    const advancedPrice = document.getElementById('advancedPrice');
    const advancedDiscount = document.getElementById('advancedDiscount');
    const elitePrice = document.getElementById('elitePrice');
    const eliteDiscount = document.getElementById('eliteDiscount');
    
    if (beginnerPrice) beginnerPrice.value = pricing.beginner.price || 49;
    if (beginnerDiscount) beginnerDiscount.value = pricing.beginner.discount || 0;
    if (advancedPrice) advancedPrice.value = pricing.advanced.price || 89;
    if (advancedDiscount) advancedDiscount.value = pricing.advanced.discount || 0;
    if (elitePrice) elitePrice.value = pricing.elite.price || 149;
    if (eliteDiscount) eliteDiscount.value = pricing.elite.discount || 0;
    
    loadFeaturesUI();
}

function saveAllPricing() {
    const pricing = {
        beginner: {
            price: parseFloat(document.getElementById('beginnerPrice').value) || 49,
            discount: parseFloat(document.getElementById('beginnerDiscount').value) || 0,
            features: getFeaturesAsText('beginner')
        },
        advanced: {
            price: parseFloat(document.getElementById('advancedPrice').value) || 89,
            discount: parseFloat(document.getElementById('advancedDiscount').value) || 0,
            features: getFeaturesAsText('advanced')
        },
        elite: {
            price: parseFloat(document.getElementById('elitePrice').value) || 149,
            discount: parseFloat(document.getElementById('eliteDiscount').value) || 0,
            features: getFeaturesAsText('elite')
        }
    };
    
    savePricing(pricing);
    alert('Pricing saved successfully!');
}

// Payment Sessions
function getPaymentSessions() {
    const stored = localStorage.getItem('karatePaymentSessions');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        upi: true,
        banking: true,
        check: true,
        screenshot: true
    };
}

function savePaymentSessions(sessions) {
    localStorage.setItem('karatePaymentSessions', JSON.stringify(sessions));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/paymentSessions', sessions);
    }
}

function loadPaymentSessions() {
    const sessions = getPaymentSessions();
    
    const toggleUpi = document.getElementById('toggleUpi');
    const toggleBanking = document.getElementById('toggleBanking');
    const toggleCheck = document.getElementById('toggleCheck');
    const toggleScreenshot = document.getElementById('toggleScreenshot');
    
    if (toggleUpi) toggleUpi.checked = sessions.upi;
    if (toggleBanking) toggleBanking.checked = sessions.banking;
    if (toggleCheck) toggleCheck.checked = sessions.check;
    if (toggleScreenshot) toggleScreenshot.checked = sessions.screenshot;
    
    updatePaymentStatusMessage();
}

function togglePaymentSession(method) {
    const sessions = getPaymentSessions();
    sessions[method] = !sessions[method];
    savePaymentSessions(sessions);
    
    updatePaymentStatusMessage();
}

function updatePaymentStatusMessage() {
    const sessions = getPaymentSessions();
    const statusEl = document.getElementById('paymentStatusMessage');
    
    if (!statusEl) return;
    
    const enabledCount = Object.values(sessions).filter(v => v).length;
    
    if (enabledCount === 0) {
        statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>All payment methods are currently disabled. Users will not be able to make payments.</span>';
        statusEl.style.background = '#ffebee';
        statusEl.style.color = '#c62828';
    } else if (enabledCount === 4) {
        statusEl.innerHTML = '<i class="fas fa-info-circle"></i> <span>All payment methods are enabled.</span>';
        statusEl.style.background = '#e3f2fd';
        statusEl.style.color = '#1976d2';
    } else {
        const disabledMethods = Object.entries(sessions)
            .filter(([_, v]) => !v)
            .map(([k, _]) => k.charAt(0).toUpperCase() + k.slice(1))
            .join(', ');
        statusEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>Disabled payment methods: ${disabledMethods}. Users cannot use these methods.</span>`;
        statusEl.style.background = '#fff3e0';
        statusEl.style.color = '#ef6c00';
    }
}

// Image Gallery Modal
function openImageGallery(galleryType, galleryImageInputId, galleryPreviewId) {
    window.currentGalleryImageInput = galleryType;
    window.currentGalleryImageInputId = galleryImageInputId;
    window.currentGalleryPreviewId = galleryPreviewId;
    
    const modal = document.getElementById('imageGalleryModal');
    if (modal) {
        modal.style.display = 'flex';
        loadGalleryImages();
    }
}

function closeImageGalleryModal() {
    const modal = document.getElementById('imageGalleryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function getGalleryImages() {
    const stored = localStorage.getItem('karateGalleryImages');
    return stored ? JSON.parse(stored) : [];
}

function saveGalleryImages(images) {
    localStorage.setItem('karateGalleryImages', JSON.stringify(images));
}

function loadGalleryImages() {
    const images = getGalleryImages();
    const grid = document.getElementById('imageGalleryGrid');
    
    if (!grid) return;
    
    if (images.length === 0) {
        grid.innerHTML = '<p class="no-data">No images uploaded yet. Upload images from the Image Gallery page.</p>';
        return;
    }
    
    grid.innerHTML = images.map(img => `
        <div class="gallery-image-item" onclick="selectGalleryImage('${img.image}', '${img.name.replace(/'/g, "\\'")}')">
            <img src="${img.image}" alt="${img.name}">
            <p>${img.name}</p>
        </div>
    `).join('');
}

function selectGalleryImage(imageData, imageName) {
    const galleryImageInput = document.getElementById(window.currentGalleryImageInputId);
    const galleryPreview = document.getElementById(window.currentGalleryPreviewId);
    const logoImageInput = document.getElementById('logoImage');
    const logoPreview = document.getElementById('logoPreview');
    
    // Try logo form
    if (logoImageInput && logoPreview) {
        logoImageInput.setAttribute('data-gallery-image', imageData);
        logoPreview.innerHTML = `<img src="${imageData}" alt="Selected from gallery"><p style="margin-top: 0.5rem; color: #27ae60;"><i class="fas fa-check"></i> Selected: ${imageName}</p>`;
        closeImageGalleryModal();
        return;
    }
    
    // Default to gallery form
    if (galleryImageInput && galleryPreview) {
        galleryImageInput.setAttribute('data-gallery-image', imageData);
        galleryPreview.innerHTML = `<img src="${imageData}" alt="Selected from gallery"><p style="margin-top: 0.5rem; color: #27ae60;"><i class="fas fa-check"></i> Selected: ${imageName}</p>`;
    }
    
    closeImageGalleryModal();
}

// Payment Session Management

// Get payment sessions from localStorage
function getPaymentSessions() {
    const stored = localStorage.getItem('karatePaymentSessions');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default: all payment methods enabled
    return {
        upi: true,
        banking: true,
        check: true,
        screenshot: true
    };
}

// Save payment sessions to localStorage
function savePaymentSessions(sessions) {
    localStorage.setItem('karatePaymentSessions', JSON.stringify(sessions));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/paymentSessions', sessions);
    }
}

// Toggle a specific payment session
function togglePaymentSession(method) {
    const sessions = getPaymentSessions();
    sessions[method] = !sessions[method];
    savePaymentSessions(sessions);
    
    // Update status message
    updatePaymentStatusMessage();
}

// Update the status message based on current sessions
function updatePaymentStatusMessage() {
    const sessions = getPaymentSessions();
    const statusEl = document.getElementById('paymentStatusMessage');
    
    if (!statusEl) return;
    
    const enabledCount = Object.values(sessions).filter(v => v).length;
    
    if (enabledCount === 0) {
        statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>All payment methods are currently disabled. Users will not be able to make payments.</span>';
        statusEl.style.background = '#ffebee';
        statusEl.style.color = '#c62828';
    } else if (enabledCount === 4) {
        statusEl.innerHTML = '<i class="fas fa-info-circle"></i> <span>All payment methods are enabled.</span>';
        statusEl.style.background = '#e3f2fd';
        statusEl.style.color = '#1976d2';
    } else {
        const disabledMethods = Object.entries(sessions)
            .filter(([_, v]) => !v)
            .map(([k, _]) => k.charAt(0).toUpperCase() + k.slice(1))
            .join(', ');
        statusEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>Disabled payment methods: ${disabledMethods}. Users cannot use these methods.</span>`;
        statusEl.style.background = '#fff3e0';
        statusEl.style.color = '#ef6c00';
    }
}

// Load payment sessions into the UI
function loadPaymentSessions() {
    const sessions = getPaymentSessions();
    
    // Set toggle states
    Object.keys(sessions).forEach(method => {
        const toggle = document.getElementById('toggle' + capitalizeFirst(method));
        if (toggle) {
            toggle.checked = sessions[method];
        }
    });
    
    updatePaymentStatusMessage();
}
