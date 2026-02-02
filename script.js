// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Plan Selection - Redirect to purchase page
function selectPlan(planName) {
    window.location.href = `purchase.html?plan=${planName}`;
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('planModal');
    modal.style.display = 'none';
}

// Member Registration
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        
        // Get selected plan from modal
        const planText = document.getElementById('selectedPlanText').textContent;
        const planMatch = planText.match(/(\w+)/);
        const plan = planMatch ? planMatch[1].toLowerCase() : 'beginner';
        
        // Create member object
        const member = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            plan: plan,
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        
        // Save to localStorage
        const members = getMembers();
        members.push(member);
        localStorage.setItem('karateMembers', JSON.stringify(members));
        
        alert('Registration successful! Welcome to Karate Academy!');
        closeModal();
        this.reset();
    });
}

// Get members from localStorage
function getMembers() {
    const stored = localStorage.getItem('karateMembers');
    return stored ? JSON.parse(stored) : [];
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Apply saved settings on page load
document.addEventListener('DOMContentLoaded', function() {
    // Apply saved settings
    const storedSettings = localStorage.getItem('karateSettings');
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        
        const navBrandText = document.querySelector('.nav-brand span');
        const navBrandIcon = document.querySelector('.nav-brand i');
        const navLogoImage = document.getElementById('navLogoImage');
        
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
        if (settings.siteName) {
            document.title = settings.siteName + ' - Master the Art';
        }
        
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
    
    // Check if user is logged in
    checkUserLogin();
    
    // Show login modal on first visit
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit && !localStorage.getItem('currentUser')) {
        setTimeout(() => showUserLogin(), 1500);
        localStorage.setItem('firstVisit', 'true');
    }
    
    // Load saved pricing
    loadSavedPricing();
    
    // Load saved videos
    loadSavedVideos();
    
    // Load gallery items
    loadMasters();
    loadChampions();
    loadAwarded();
});

// Check user login status
function checkUserLogin() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        document.getElementById('userLoginLink').style.display = 'none';
        document.getElementById('userProfileLink').style.display = 'flex';
        document.getElementById('userNameDisplay').textContent = user.name.split(' ')[0];
    } else {
        document.getElementById('userLoginLink').style.display = 'flex';
        document.getElementById('userProfileLink').style.display = 'none';
    }
}

// Show user login modal
function showUserLogin() {
    document.getElementById('userLoginModal').style.display = 'flex';
}

// Close user login modal
function closeUserLogin() {
    document.getElementById('userLoginModal').style.display = 'none';
}

// User login form submit
document.getElementById('userLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('userEmail').value;
    const members = getMembers();
    const member = members.find(m => m.email === email);
    
    if (member) {
        localStorage.setItem('currentUser', JSON.stringify(member));
        closeUserLogin();
        checkUserLogin();
        showUserProfile();
    } else {
        document.getElementById('loginError').textContent = 'Email not found. Please register first.';
    }
});

// Show user profile
function showUserProfile() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const pricing = getPricing();
        const planPrice = pricing[user.plan] ? pricing[user.plan].price : 0;
        const planDiscount = pricing[user.plan] ? pricing[user.plan].discount : 0;
        const finalPrice = planPrice - (planPrice * planDiscount / 100);
        
        const profileContent = document.getElementById('userProfileContent');
        profileContent.innerHTML = `
            <div class="profile-field">
                <label>Name:</label>
                <span>${user.name}</span>
            </div>
            <div class="profile-field">
                <label>Email:</label>
                <span>${user.email}</span>
            </div>
            <div class="profile-field">
                <label>Phone:</label>
                <span>${user.phone || 'Not provided'}</span>
            </div>
            <div class="profile-field">
                <label>Membership Plan:</label>
                <span class="plan-badge ${user.plan}">${capitalizeFirst(user.plan)}</span>
            </div>
            <div class="profile-field">
                <label>Monthly Price:</label>
                <span>₹${finalPrice}/month</span>
            </div>
            <div class="profile-field">
                <label>Member Since:</label>
                <span>${user.joinDate}</span>
            </div>
            <div class="profile-field">
                <label>Status:</label>
                <span class="status-badge ${user.status}">${capitalizeFirst(user.status)}</span>
            </div>
        `;
        
        document.getElementById('userProfileModal').style.display = 'flex';
    }
}

// Close user profile modal
function closeUserProfile() {
    document.getElementById('userProfileModal').style.display = 'none';
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
    closeUserProfile();
    checkUserLogin();
}

// Get pricing from localStorage
function getPricing() {
    const stored = localStorage.getItem('karatePricing');
    if (stored) {
        return JSON.parse(stored);
    }
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

// Load saved pricing and update display
function loadSavedPricing() {
    const pricing = getPricing();
    const container = document.getElementById('plansContainer');
    
    if (!container) {
        // Fallback to old method if container not found
        updateExistingPlanCards(pricing);
        return;
    }
    
    // Plan configurations
    const planConfigs = {
        beginner: {
            icon: 'fas fa-star',
            title: 'Beginner',
            featured: false,
            btnClass: 'btn btn-outline',
            btnText: 'Select Plan'
        },
        advanced: {
            icon: 'fas fa-crown',
            title: 'Advanced',
            featured: true,
            badge: 'Most Popular',
            btnClass: 'btn btn-primary',
            btnText: 'Select Plan'
        },
        elite: {
            icon: 'fas fa-dragon',
            title: 'Elite',
            featured: false,
            btnClass: 'btn btn-outline',
            btnText: 'Select Plan'
        }
    };
    
    // Generate plan cards
    container.innerHTML = Object.keys(planConfigs).map(planKey => {
        const plan = pricing[planKey] || { price: 49, discount: 0, features: ['Basic features'] };
        const config = planConfigs[planKey];
        const finalPrice = plan.price - (plan.price * plan.discount / 100);
        const features = plan.features || [];
        
        return `
            <div class="plan-card ${config.featured ? 'featured' : ''}">
                ${config.badge ? `<div class="popular-badge">${config.badge}</div>` : ''}
                <div class="plan-header">
                    <i class="${config.icon}"></i>
                    <h3>${config.title}</h3>
                </div>
                <div class="plan-price">
                    <span class="currency">₹</span>
                    <span class="amount">${finalPrice.toFixed(0)}</span>
                    <span class="period">/month</span>
                    ${plan.discount > 0 ? `<span class="original-price" style="text-decoration: line-through; color: #999; margin-left: 0.5rem; font-size: 0.9rem;">₹${plan.price}</span>` : ''}
                </div>
                <ul class="plan-features">
                    ${features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                </ul>
                <button class="${config.btnClass}" onclick="selectPlan('${planKey}')">${config.btnText}</button>
            </div>
        `;
    }).join('');
}

// Update existing plan cards (fallback)
function updateExistingPlanCards(pricing) {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        const header = card.querySelector('.plan-header h3');
        const amount = card.querySelector('.plan-price .amount');
        const original = card.querySelector('.plan-price');
        
        if (header && amount) {
            const planName = header.textContent.toLowerCase();
            if (pricing[planName]) {
                const finalPrice = pricing[planName].price - (pricing[planName].price * pricing[planName].discount / 100);
                amount.textContent = finalPrice.toFixed(0);
                
                // Remove existing original price if any
                const existingOriginal = original.querySelector('.original-price');
                if (existingOriginal) existingOriginal.remove();
                
                // Show original price if discount
                if (pricing[planName].discount > 0) {
                    const originalPrice = document.createElement('span');
                    originalPrice.className = 'original-price';
                    originalPrice.style.textDecoration = 'line-through';
                    originalPrice.style.color = '#999';
                    originalPrice.style.marginLeft = '0.5rem';
                    originalPrice.style.fontSize = '0.9rem';
                    originalPrice.textContent = '₹' + pricing[planName].price;
                    original.appendChild(originalPrice);
                }
            }
        }
    });
}

// Video Category Tab Switching
function showVideoCategory(category) {
    document.querySelectorAll('.video-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.video-category').forEach(cat => {
        cat.classList.remove('active');
    });
    document.getElementById(category).classList.add('active');
}

// Show membership prompt when locked video is clicked
function showMembershipPrompt() {
    alert('This video is available for members only.\n\nUpgrade to Advanced or Elite membership to access all training videos!');
    document.getElementById('membership').scrollIntoView({
        behavior: 'smooth'
    });
}

// Load saved videos from localStorage
function loadSavedVideos() {
    const storedVideos = localStorage.getItem('karateVideos');
    if (storedVideos) {
        const videos = JSON.parse(storedVideos);
        const categories = ['kata', 'beginner', 'kumite'];
        
        categories.forEach(cat => {
            const catVideos = videos.filter(v => v.category === cat);
            if (catVideos.length > 0) {
                const categoryDiv = document.getElementById(cat);
                if (categoryDiv) {
                    const videoGrid = categoryDiv.querySelector('.video-grid');
                    if (videoGrid) {
                        videoGrid.innerHTML = catVideos.map(video => `
                            <div class="video-card">
                                <div class="video-thumbnail ${video.level} ${video.thumbnail ? 'custom-thumbnail' : ''}" onclick="${video.level === 'locked' ? 'showMembershipPrompt()' : ''}" ${video.thumbnail ? 'style="background-image: url(' + video.thumbnail + '); background-size: cover; background-position: center;"' : ''}>
                                    ${video.thumbnail ? '' : '<i class="fas ' + (video.level === 'locked' ? 'fa-lock' : 'fa-play-circle') + '"></i>'}
                                    <span class="video-duration">${video.duration}</span>
                                    ${video.level === 'locked' ? '<div class="lock-overlay"><i class="fas fa-crown"></i><span>Members Only</span></div>' : ''}
                                </div>
                                <div class="video-info">
                                    <h4>${video.title}</h4>
                                    <p>${video.description}</p>
                                    <span class="video-level ${video.level}">
                                        <i class="fas ${video.level === 'free' ? 'fa-check' : 'fa-lock'}"></i>
                                        ${video.level === 'free' ? 'Free Preview' : 'Members Only'}
                                    </span>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            }
        });
    }
}

// Get Masters from localStorage
function getMasters() {
    const stored = localStorage.getItem('karateMasters');
    return stored ? JSON.parse(stored) : [];
}

// Get Champions from localStorage
function getChampions() {
    const stored = localStorage.getItem('karateChampions');
    return stored ? JSON.parse(stored) : [];
}

// Get Awarded from localStorage
function getAwarded() {
    const stored = localStorage.getItem('karateAwarded');
    return stored ? JSON.parse(stored) : [];
}

// Load Masters gallery
function loadMasters() {
    const masters = getMasters();
    const grid = document.getElementById('mastersGrid');
    if (grid) {
        if (masters.length === 0) {
            grid.innerHTML = '<p class="no-data">No masters added yet. Use the admin panel to add masters.</p>';
        } else {
            grid.innerHTML = masters.map(master => `
                <div class="gallery-card" onclick="openGalleryDetail('masters', ${master.id})">
                    <div class="gallery-image">
                        ${master.image ? `<img src="${master.image}" alt="${master.name}">` : '<div class="no-image"><i class="fas fa-user"></i></div>'}
                        <span class="gallery-tag">${master.tag || 'Master'}</span>
                    </div>
                    <div class="gallery-info">
                        <h4>${master.name}</h4>
                        <p>${master.subtitle || ''}</p>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Load Champions gallery
function loadChampions() {
    const champions = getChampions();
    const grid = document.getElementById('championsGrid');
    if (grid) {
        if (champions.length === 0) {
            grid.innerHTML = '<p class="no-data">No champions added yet. Use the admin panel to add champions.</p>';
        } else {
            grid.innerHTML = champions.map(champion => `
                <div class="gallery-card" onclick="openGalleryDetail('champions', ${champion.id})">
                    <div class="gallery-image">
                        ${champion.image ? `<img src="${champion.image}" alt="${champion.name}">` : '<div class="no-image"><i class="fas fa-trophy"></i></div>'}
                        <span class="gallery-tag">${champion.tag || 'Champion'}</span>
                    </div>
                    <div class="gallery-info">
                        <h4>${champion.name}</h4>
                        <p>${champion.subtitle || ''}</p>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Load Awarded gallery
function loadAwarded() {
    const awarded = getAwarded();
    const grid = document.getElementById('awardedGrid');
    if (grid) {
        if (awarded.length === 0) {
            grid.innerHTML = '<p class="no-data">No awards added yet. Use the admin panel to add awards.</p>';
        } else {
            grid.innerHTML = awarded.map(item => `
                <div class="gallery-card" onclick="openGalleryDetail('awarded', ${item.id})">
                    <div class="gallery-image">
                        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="no-image"><i class="fas fa-medal"></i></div>'}
                        <span class="gallery-tag">${item.tag || 'Award'}</span>
                    </div>
                    <div class="gallery-info">
                        <h4>${item.name}</h4>
                        <p>${item.subtitle || ''}</p>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Open gallery detail modal
function openGalleryDetail(type, id) {
    let items;
    if (type === 'masters') items = getMasters();
    else if (type === 'champions') items = getChampions();
    else items = getAwarded();
    
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const modal = document.getElementById('galleryDetailModal');
    const content = document.getElementById('galleryDetailContent');
    
    content.innerHTML = `
        <div class="gallery-detail-image">
            ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="no-image-large"><i class="fas fa-image"></i></div>'}
        </div>
        <div class="gallery-detail-info">
            <h3>${item.name}</h3>
            <p class="gallery-detail-subtitle">${item.subtitle || ''}</p>
            <span class="gallery-detail-tag">${item.tag || type}</span>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Close gallery detail modal
function closeGalleryDetail() {
    document.getElementById('galleryDetailModal').style.display = 'none';
}

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .plan-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add some interactive hover effects for plan cards
document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = card.classList.contains('featured') 
            ? 'scale(1.05) translateY(-5px)' 
            : 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = card.classList.contains('featured') 
            ? 'scale(1.05)' 
            : 'translateY(0)';
    });
});

console.log('Karate Academy website loaded successfully!');
