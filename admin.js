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
const ADMIN_USER = 'kK';
const ADMIN_PASS = 'kK';

// Check if already logged in
if (localStorage.getItem('adminLoggedIn') === 'true') {
    console.log('Already logged in, showing admin panel');
    showAdminPanel();
}

// Login Form Handler - wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    console.log('Login form found:', !!loginForm);
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('loginError');
            
            console.log('Username:', username);
            console.log('Expected user:', ADMIN_USER);
            console.log('Password match:', password === ADMIN_PASS);
            
            if (username === ADMIN_USER && password === ADMIN_PASS) {
                console.log('Login successful!');
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
                if (errorEl) errorEl.textContent = '';
            } else {
                console.log('Login failed - invalid credentials');
                if (errorEl) errorEl.textContent = 'Invalid username or password';
            }
        });
    }
});

// Show Admin Panel
function showAdminPanel() {
    console.log('Showing admin panel');
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    console.log('Login section:', !!loginSection);
    console.log('Admin panel:', !!adminPanel);
    
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
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginForm').reset();
}

// Show Admin Section
function showAdminSection(section) {
    document.querySelectorAll('.admin-section').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.admin-tab').forEach(el => {
        el.classList.remove('active');
    });
    
    document.getElementById('admin' + capitalizeFirst(section)).style.display = 'block';
    event.target.classList.add('active');
    
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
    document.getElementById('totalVideos').textContent = videos.length;
    document.getElementById('freeVideos').textContent = videos.filter(v => v.level === 'free').length;
    document.getElementById('lockedVideos').textContent = videos.filter(v => v.level === 'locked').length;
    
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
    event.target.classList.add('active');
    loadVideos(category);
}

// Load Masters
function loadMasters() {
    const masters = getMasters();
    const container = document.getElementById('mastersList');
    
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
    document.getElementById('totalMembers').textContent = members.length;
    document.getElementById('beginnerMembers').textContent = members.filter(m => m.plan === 'beginner').length;
    document.getElementById('advancedMembers').textContent = members.filter(m => m.plan === 'advanced').length;
    document.getElementById('eliteMembers').textContent = members.filter(m => m.plan === 'elite').length;
    
    let filteredMembers = members;
    if (filter !== 'all') {
        filteredMembers = members.filter(m => m.plan === filter);
    }
    
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
                <p class="video-item-desc">Joined: ${member.joinDate} | Status: ${member.status}</p>
                <div class="video-item-actions">
                    <button class="btn-edit" onclick="showUpgradeModal(${member.id}, '${member.name}')">
                        <i class="fas fa-arrow-up"></i> Upgrade
                    </button>
                    <button class="btn-delete" onclick="deleteGalleryPrompt(${member.id}, 'members')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Members
function filterMembers(plan) {
    document.querySelectorAll('#adminMembers .filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    loadMembers(plan);
}

// Show Add Member Modal
function showAddMemberModal() {
    document.getElementById('memberModalTitle').textContent = 'Add New Member';
    document.getElementById('memberForm').reset();
    document.getElementById('editMemberId').value = '';
    document.getElementById('memberModal').style.display = 'flex';
}

// Close Member Modal
function closeMemberModal() {
    document.getElementById('memberModal').style.display = 'none';
}

// Member Form Submit
document.getElementById('memberForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const editId = document.getElementById('editMemberId').value;
    const memberData = {
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        plan: document.getElementById('memberPlan').value,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    
    let members = getMembers();
    
    if (editId) {
        const index = members.findIndex(m => m.id === parseInt(editId));
        if (index !== -1) {
            members[index] = { ...members[index], ...memberData };
        }
    } else {
        const newId = Date.now();
        members.push({ id: newId, ...memberData });
    }
    
    saveMembers(members);
    closeMemberModal();
    loadMembers();
    alert(editId ? 'Member updated successfully!' : 'Member added successfully!');
});

// Show Upgrade Modal
function showUpgradeModal(id, name) {
    document.getElementById('upgradeMemberId').value = id;
    document.getElementById('upgradeMemberName').textContent = `Upgrade membership for: ${name}`;
    document.getElementById('upgradeModal').style.display = 'flex';
}

// Close Upgrade Modal
function closeUpgradeModal() {
    document.getElementById('upgradeModal').style.display = 'none';
}

// Upgrade Form Submit
document.getElementById('upgradeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('upgradeMemberId').value);
    const newPlan = document.getElementById('newPlan').value;
    
    let members = getMembers();
    const index = members.findIndex(m => m.id === id);
    
    if (index !== -1) {
        members[index].plan = newPlan;
        saveMembers(members);
        closeUpgradeModal();
        loadMembers();
        alert(`Member upgraded to ${capitalizeFirst(newPlan)} plan successfully!`);
    }
});

// Load Settings
function loadSettings() {
    const settings = getSettings();
    
    // Logo settings
    document.getElementById('siteName').value = settings.siteName || '';
    document.getElementById('logoIcon').value = settings.logoIcon || 'fas fa-fist-raised';
    
    // Logo image preview
    const logoPreview = document.getElementById('logoImagePreview');
    if (settings.logoImage) {
        logoPreview.innerHTML = '<img src="' + settings.logoImage + '" alt="Logo Preview">';
    } else {
        logoPreview.innerHTML = '';
    }
    
    // Contact settings
    document.getElementById('contactAddress').value = settings.contactAddress || '';
    document.getElementById('contactPhone').value = settings.contactPhone || '';
    document.getElementById('contactEmail').value = settings.contactEmail || '';
    document.getElementById('contactHours').value = settings.contactHours || '';
}

// Preview logo image
function previewLogoImage(input) {
    const preview = document.getElementById('logoImagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = '<img src="' + e.target.result + '" alt="Logo Preview">';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Preview gallery image
function previewGalleryImage(input) {
    const preview = document.getElementById('galleryImagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = '<img src="' + e.target.result + '" alt="Image Preview">';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Preview video thumbnail
function previewVideoThumbnail(input) {
    const preview = document.getElementById('videoThumbnailPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = '<img src="' + e.target.result + '" alt="Video Thumbnail Preview">';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Show video image gallery modal
function showVideoImageGalleryModal() {
    const modal = document.getElementById('imageGalleryModal');
    const grid = document.getElementById('imageGalleryGrid');
    
    // Collect all images from all galleries
    const masters = getMasters();
    const champions = getChampions();
    const awarded = getAwarded();
    
    const allImages = [
        ...masters.map(m => ({ ...m, source: 'masters' })),
        ...champions.map(c => ({ ...c, source: 'champions' })),
        ...awarded.map(a => ({ ...a, source: 'awarded' }))
    ];
    
    // Filter only items with images
    const imagesWithData = allImages.filter(item => item.image);
    
    if (imagesWithData.length === 0) {
        grid.innerHTML = '';
    } else {
        grid.innerHTML = imagesWithData.map(item => `
            <div class="gallery-image-item" onclick="selectVideoThumbnail('${item.image.replace(/'/g, "\\'")}', '${item.name.replace(/'/g, "\\'")}')">
                <img src="${item.image}" alt="${item.name}">
                <div class="image-name">${item.name}</div>
            </div>
        `).join('');
    }
    
    modal.style.display = 'flex';
}

// Select video thumbnail from gallery
function selectVideoThumbnail(imageData, imageName) {
    const thumbnailInput = document.getElementById('videoThumbnail');
    const preview = document.getElementById('videoThumbnailPreview');
    
    thumbnailInput.setAttribute('data-gallery-image', imageData);
    preview.innerHTML = `<img src="${imageData}" alt="Selected thumbnail"><p style="margin-top: 0.5rem; color: #27ae60;"><i class="fas fa-check"></i> Selected: ${imageName}</p>`;
    
    closeImageGalleryModal();
}

// Load Pricing
function loadPricing() {
    const pricing = getPricing();
    
    document.getElementById('beginnerPrice').value = pricing.beginner.price;
    document.getElementById('beginnerDiscount').value = pricing.beginner.discount;
    document.getElementById('beginnerFeatures').value = (pricing.beginner.features || []).join('\n');
    updatePricePreview('beginner');
    
    document.getElementById('advancedPrice').value = pricing.advanced.price;
    document.getElementById('advancedDiscount').value = pricing.advanced.discount;
    document.getElementById('advancedFeatures').value = (pricing.advanced.features || []).join('\n');
    updatePricePreview('advanced');
    
    document.getElementById('elitePrice').value = pricing.elite.price;
    document.getElementById('eliteDiscount').value = pricing.elite.discount;
    document.getElementById('eliteFeatures').value = (pricing.elite.features || []).join('\n');
    updatePricePreview('elite');
    
    // Load features UI
    loadFeaturesUI();
}

// Get pricing from localStorage
function getPricing() {
    const stored = localStorage.getItem('karatePricing');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default pricing with features
    return {
        beginner: { 
            price: 49, 
            discount: 0,
            features: ['Basic training videos', 'Beginner kata tutorials', 'Community access']
        },
        advanced: { 
            price: 89, 
            discount: 0,
            features: ['All Beginner features', 'Advanced kata training', 'Kumite techniques', 'Priority support']
        },
        elite: { 
            price: 149, 
            discount: 0,
            features: ['All Advanced features', '1-on-1 coaching sessions', 'Exclusive content', 'Personalized training plan']
        }
    };
}

// Save pricing to localStorage
function savePricing(pricing) {
    localStorage.setItem('karatePricing', JSON.stringify(pricing));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/pricing', pricing);
    }
}

// Update price preview
function updatePricePreview(plan) {
    const price = parseFloat(document.getElementById(plan + 'Price').value) || 0;
    const discount = parseFloat(document.getElementById(plan + 'Discount').value) || 0;
    const finalPrice = price - (price * discount / 100);
    
    document.getElementById(plan + 'Original').textContent = price;
    document.getElementById(plan + 'Final').textContent = finalPrice.toFixed(2);
}

// Add event listeners for price inputs
['beginner', 'advanced', 'elite'].forEach(plan => {
    document.getElementById(plan + 'Price').addEventListener('input', () => updatePricePreview(plan));
    document.getElementById(plan + 'Discount').addEventListener('input', () => updatePricePreview(plan));
});

// Pricing Form Submit
document.getElementById('pricingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get features from the new features UI
    const features = getFeatures();
    
    const pricing = {
        beginner: {
            price: parseFloat(document.getElementById('beginnerPrice').value),
            discount: parseFloat(document.getElementById('beginnerDiscount').value),
            features: features.beginner.filter(f => f.enabled).map(f => f.text)
        },
        advanced: {
            price: parseFloat(document.getElementById('advancedPrice').value),
            discount: parseFloat(document.getElementById('advancedDiscount').value),
            features: features.advanced.filter(f => f.enabled).map(f => f.text)
        },
        elite: {
            price: parseFloat(document.getElementById('elitePrice').value),
            discount: parseFloat(document.getElementById('eliteDiscount').value),
            features: features.elite.filter(f => f.enabled).map(f => f.text)
        }
    };
    
    savePricing(pricing);
    
    // Update main site pricing
    updateSitePricing(pricing);
    
    alert('Pricing settings saved successfully!');
});

// Update site pricing
function updateSitePricing(pricing) {
    // Update membership cards
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        const header = card.querySelector('.plan-header h3');
        const amount = card.querySelector('.plan-price .amount');
        const featuresList = card.querySelector('.plan-features');
        
        if (header && amount) {
            const planName = header.textContent.toLowerCase();
            if (pricing[planName]) {
                const finalPrice = pricing[planName].price - (pricing[planName].price * pricing[planName].discount / 100);
                amount.textContent = finalPrice.toFixed(0);
                
                // Update features list
                if (featuresList && pricing[planName].features) {
                    featuresList.innerHTML = '';
                    pricing[planName].features.forEach(feature => {
                        const li = document.createElement('li');
                        li.innerHTML = '<i class="fas fa-check"></i> ' + feature;
                        featuresList.appendChild(li);
                    });
                }
            }
        }
    });
}

// Get settings from localStorage
function getSettings() {
    const stored = localStorage.getItem('karateSettings');
    return stored ? JSON.parse(stored) : {};
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem('karateSettings', JSON.stringify(settings));
    window.dispatchEvent(new Event('karateDataChange'));
    // Sync to Firebase
    if (typeof firebaseSync !== 'undefined' && firebaseSync.isAvailable()) {
        firebaseSync.save('karateApp/settings', settings);
    }
}

// Logo Form Submit
document.getElementById('logoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const settings = getSettings();
    settings.siteName = document.getElementById('siteName').value;
    settings.logoIcon = document.getElementById('logoIcon').value;
    
    // Handle logo image upload or gallery selection
    const logoImageInput = document.getElementById('logoImage');
    const galleryImage = logoImageInput.getAttribute('data-gallery-image');
    
    if (galleryImage) {
        // Use image selected from gallery
        settings.logoImage = galleryImage;
        saveSettings(settings);
        updateSiteLogo(settings);
        alert('Logo settings saved successfully!');
    } else if (logoImageInput.files && logoImageInput.files[0]) {
        // Upload new image
        const reader = new FileReader();
        reader.onload = function(event) {
            settings.logoImage = event.target.result;
            saveSettings(settings);
            updateSiteLogo(settings);
            alert('Logo settings saved successfully!');
        };
        reader.readAsDataURL(logoImageInput.files[0]);
    } else {
        saveSettings(settings);
        updateSiteLogo(settings);
        alert('Logo settings saved successfully!');
    }
});

// Contact Form Submit
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const settings = getSettings();
    settings.contactAddress = document.getElementById('contactAddress').value;
    settings.contactPhone = document.getElementById('contactPhone').value;
    settings.contactEmail = document.getElementById('contactEmail').value;
    settings.contactHours = document.getElementById('contactHours').value;
    
    saveSettings(settings);
    
    // Update main site
    updateContactInfo(settings);
    
    alert('Contact settings saved successfully!');
});

// Update site logo
function updateSiteLogo(settings) {
    const navBrandText = document.querySelector('.nav-brand span');
    const navBrandIcon = document.querySelector('.nav-brand i');
    const navLogoImage = document.getElementById('navLogoImage') || document.getElementById('adminNavLogoImage');
    
    if (navBrandText && settings.siteName) {
        navBrandText.textContent = settings.siteName;
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
    
    // Update page title
    if (settings.siteName) {
        document.title = settings.siteName + ' - Master the Art';
    }
}

// Update contact info
function updateContactInfo(settings) {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const icon = item.querySelector('i');
        const text = item.querySelector('p');
        
        if (icon && text) {
            if (icon.classList.contains('fa-map-marker-alt') && settings.contactAddress) {
                text.textContent = settings.contactAddress;
            } else if (icon.classList.contains('fa-phone') && settings.contactPhone) {
                text.textContent = settings.contactPhone;
            } else if (icon.classList.contains('fa-envelope') && settings.contactEmail) {
                text.textContent = settings.contactEmail;
            } else if (icon.classList.contains('fa-clock') && settings.contactHours) {
                text.textContent = settings.contactHours;
            }
        }
    });
}

// Show Add Video Modal
function showAddVideoModal() {
    document.getElementById('modalTitle').textContent = 'Add New Video';
    document.getElementById('videoForm').reset();
    document.getElementById('editVideoId').value = '';
    document.getElementById('videoThumbnail').removeAttribute('data-gallery-image');
    document.getElementById('videoThumbnailPreview').innerHTML = '';
    
    // Check if there's a selected video from gallery
    const selectedVideo = localStorage.getItem('selectedGalleryVideo');
    if (selectedVideo) {
        const video = JSON.parse(selectedVideo);
        document.getElementById('videoTitle').value = video.title || '';
        document.getElementById('videoCategory').value = video.category || 'kata';
        document.getElementById('videoDuration').value = video.duration || '';
        document.getElementById('videoLevel').value = video.level || 'free';
        document.getElementById('videoDescription').value = video.description || '';
        
        if (video.thumbnail) {
            document.getElementById('videoThumbnail').setAttribute('data-gallery-image', video.thumbnail);
            document.getElementById('videoThumbnailPreview').innerHTML = '<img src="' + video.thumbnail + '" alt="Video Thumbnail"><p style="margin-top:0.5rem;color:#27ae60;"><i class="fas fa-check"></i> Selected from gallery</p>';
        }
        
        // Clear the stored selection
        localStorage.removeItem('selectedGalleryVideo');
    }
    
    document.getElementById('videoModal').style.display = 'flex';
}

// Edit Video
function editVideo(id) {
    const videos = getVideos();
    const video = videos.find(v => v.id === id);
    
    if (video) {
        document.getElementById('modalTitle').textContent = 'Edit Video';
        document.getElementById('editVideoId').value = video.id;
        document.getElementById('videoTitle').value = video.title;
        document.getElementById('videoCategory').value = video.category;
        document.getElementById('videoDuration').value = video.duration;
        document.getElementById('videoLevel').value = video.level;
        document.getElementById('videoDescription').value = video.description;
        document.getElementById('videoThumbnail').removeAttribute('data-gallery-image');
        
        // Show existing thumbnail if available
        const thumbnailPreview = document.getElementById('videoThumbnailPreview');
        if (video.thumbnail) {
            thumbnailPreview.innerHTML = '<img src="' + video.thumbnail + '" alt="Video Thumbnail">';
        } else {
            thumbnailPreview.innerHTML = '';
        }
        
        document.getElementById('videoModal').style.display = 'flex';
    }
}

// Close Video Modal
function closeVideoModal() {
    document.getElementById('videoModal').style.display = 'none';
}

// Video Form Submit
document.getElementById('videoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const editId = document.getElementById('editVideoId').value;
    const videoData = {
        title: document.getElementById('videoTitle').value,
        category: document.getElementById('videoCategory').value,
        duration: document.getElementById('videoDuration').value,
        level: document.getElementById('videoLevel').value,
        description: document.getElementById('videoDescription').value
    };
    
    // Handle thumbnail
    const thumbnailInput = document.getElementById('videoThumbnail');
    const galleryThumbnail = thumbnailInput.getAttribute('data-gallery-image');
    
    const handleVideoSave = (thumbnail) => {
        if (thumbnail) {
            videoData.thumbnail = thumbnail;
        }
        
        let videos = getVideos();
        
        if (editId) {
            const index = videos.findIndex(v => v.id === parseInt(editId));
            if (index !== -1) {
                videos[index] = { ...videos[index], ...videoData };
            }
        } else {
            const newId = Math.max(...videos.map(v => v.id), 0) + 1;
            videos.push({ id: newId, ...videoData });
        }
        
        saveVideos(videos);
        closeVideoModal();
        loadVideos();
        alert(editId ? 'Video updated successfully!' : 'Video added successfully!');
    };
    
    if (galleryThumbnail) {
        handleVideoSave(galleryThumbnail);
    } else if (thumbnailInput.files && thumbnailInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            handleVideoSave(event.target.result);
        };
        reader.readAsDataURL(thumbnailInput.files[0]);
    } else {
        handleVideoSave(null);
    }
});

// Delete Video Prompt
function deleteVideoPrompt(id) {
    document.getElementById('deleteVideoId').value = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

// Show Add Gallery Modal
function showAddGalleryModal(type) {
    document.getElementById('galleryModalTitle').textContent = 'Add New ' + capitalizeFirst(type.slice(0, -1));
    document.getElementById('galleryForm').reset();
    document.getElementById('editGalleryId').value = '';
    document.getElementById('galleryType').value = type;
    document.getElementById('galleryModal').style.display = 'flex';
}

// Edit Gallery
function editGallery(id, type) {
    let items;
    if (type === 'masters') items = getMasters();
    else if (type === 'champions') items = getChampions();
    else items = getAwarded();
    
    const item = items.find(i => i.id === id);
    
    if (item) {
        document.getElementById('galleryModalTitle').textContent = 'Edit ' + capitalizeFirst(type.slice(0, -1));
        document.getElementById('editGalleryId').value = item.id;
        document.getElementById('galleryType').value = type;
        document.getElementById('galleryName').value = item.name;
        document.getElementById('gallerySubtitle').value = item.subtitle;
        document.getElementById('galleryTag').value = item.tag;
        document.getElementById('galleryModal').style.display = 'flex';
    }
}

// Close Gallery Modal
function closeGalleryModal() {
    document.getElementById('galleryModal').style.display = 'none';
}

// Gallery Form Submit
document.getElementById('galleryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const type = document.getElementById('galleryType').value;
    const editId = document.getElementById('editGalleryId').value;
    const imageFile = document.getElementById('galleryImage').files[0];
    
    const itemData = {
        name: document.getElementById('galleryName').value,
        subtitle: document.getElementById('gallerySubtitle').value,
        tag: document.getElementById('galleryTag').value
    };
    
    let items;
    let saveFn;
    
    if (type === 'masters') {
        items = getMasters();
        saveFn = saveMasters;
    } else if (type === 'champions') {
        items = getChampions();
        saveFn = saveChampions;
    } else {
        items = getAwarded();
        saveFn = saveAwarded;
    }
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            itemData.image = event.target.result;
            saveGalleryItem(type, editId, itemData, items, saveFn);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Keep existing image if no new image uploaded
        if (editId) {
            const existingItem = items.find(i => i.id === parseInt(editId));
            if (existingItem && existingItem.image) {
                itemData.image = existingItem.image;
            }
        }
        saveGalleryItem(type, editId, itemData, items, saveFn);
    }
});

function saveGalleryItem(type, editId, itemData, items, saveFn) {
    // Check for gallery image selection
    const galleryImageInput = document.getElementById('galleryImage');
    if (galleryImageInput && galleryImageInput.getAttribute('data-gallery-image')) {
        itemData.image = galleryImageInput.getAttribute('data-gallery-image');
    }
    
    if (editId) {
        const index = items.findIndex(i => i.id === parseInt(editId));
        if (index !== -1) {
            items[index] = { ...items[index], ...itemData };
        }
    } else {
        const newId = Math.max(...items.map(i => i.id), 0) + 1;
        items.push({ id: newId, ...itemData });
    }
    
    saveFn(items);
    closeGalleryModal();
    
    if (type === 'masters') loadMasters();
    else if (type === 'champions') loadChampions();
    else loadAwarded();
    
    alert(editId ? 'Entry updated successfully!' : 'Entry added successfully!');
}

// Delete Gallery Prompt
function deleteGalleryPrompt(id, type) {
    document.getElementById('deleteGalleryId').value = id;
    document.getElementById('deleteGalleryType').value = type;
    document.getElementById('deleteModal').style.display = 'flex';
}

// Close Delete Modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

// Confirm Delete
function confirmDelete() {
    const id = parseInt(document.getElementById('deleteGalleryId').value);
    const type = document.getElementById('deleteGalleryType').value;
    
    let items, saveFn;
    
    if (type === 'masters') {
        items = getMasters();
        saveFn = saveMasters;
    } else if (type === 'champions') {
        items = getChampions();
        saveFn = saveChampions;
    } else if (type === 'members') {
        items = getMembers();
        saveFn = saveMembers;
    } else if (type === 'videos') {
        items = getVideos();
        saveFn = saveVideos;
    } else {
        items = getAwarded();
        saveFn = saveAwarded;
    }
    
    items = items.filter(i => i.id !== id);
    saveFn(items);
    
    closeDeleteModal();
    
    if (type === 'masters') loadMasters();
    else if (type === 'champions') loadChampions();
    else if (type === 'awarded') loadAwarded();
    else if (type === 'members') loadMembers();
    else loadVideos();
    
    alert('Entry deleted successfully!');
}

// Utility function
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Image Gallery Modal Functions
function showImageGalleryModal() {
    const modal = document.getElementById('imageGalleryModal');
    const grid = document.getElementById('imageGalleryGrid');
    
    // Collect all images from all galleries
    const masters = getMasters();
    const champions = getChampions();
    const awarded = getAwarded();
    
    const allImages = [
        ...masters.map(m => ({ ...m, source: 'masters' })),
        ...champions.map(c => ({ ...c, source: 'champions' })),
        ...awarded.map(a => ({ ...a, source: 'awarded' }))
    ];
    
    // Filter only items with images
    const imagesWithData = allImages.filter(item => item.image);
    
    if (imagesWithData.length === 0) {
        grid.innerHTML = '';
        grid.classList.add('empty-gallery');
    } else {
        grid.innerHTML = imagesWithData.map(item => `
            <div class="gallery-image-item" onclick="selectGalleryImage('${item.image}', '${item.name.replace(/'/g, "\\'")}')">
                <img src="${item.image}" alt="${item.name}">
                <div class="image-name">${item.name}</div>
            </div>
        `).join('');
        grid.classList.remove('empty-gallery');
    }
    
    modal.style.display = 'flex';
}

function closeImageGalleryModal() {
    document.getElementById('imageGalleryModal').style.display = 'none';
}

function selectGalleryImage(imageData, imageName) {
    // Check if we're in gallery form or logo form
    const galleryImageInput = document.getElementById('galleryImage');
    const galleryPreview = document.getElementById('galleryImagePreview');
    const logoImageInput = document.getElementById('logoImage');
    const logoPreview = document.getElementById('logoImagePreview');
    
    // Try to set in gallery form first (if visible)
    if (galleryImageInput && galleryPreview && galleryImageInput.closest('.form-group').style.display !== 'none') {
        // Store the image data directly
        galleryImageInput.setAttribute('data-gallery-image', imageData);
        galleryPreview.innerHTML = `<img src="${imageData}" alt="Selected from gallery"><p style="margin-top: 0.5rem; color: #27ae60;"><i class="fas fa-check"></i> Selected: ${imageName}</p>`;
        closeImageGalleryModal();
        return;
    }
    
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
    
    // Update status message
    updatePaymentStatusMessage();
}

console.log('Admin panel loaded successfully!');
