/**
 * CyberSage - Static Version for GitHub Pages
 * 
 * Repository: https://github.com/cyberwolfarmy121-art/cybersage
 */

// Your OpenAI API Key - Replace with your actual key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

// Chat functionality
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    const loadingId = showLoading();

    try {
        const response = await callOpenAI(message);
        removeLoading(loadingId);
        addMessage(response, 'bot');
    } catch (error) {
        console.error('API Error:', error);
        removeLoading(loadingId);
        const fallback = generateFallbackResponse(message);
        addMessage(fallback, 'bot');
    }
}

async function callOpenAI(message) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are CyberSage, a cybersecurity assistant. Focus on defensive security, ethical hacking, network security, web application security, incident response, and compliance. Use markdown formatting.' },
                { role: 'user', content: message }
            ],
            max_tokens: 2000,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = type === 'user' ? 'user-avatar' : 'bot-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = formatMessage(content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(text) {
    let formatted = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    formatted = formatted.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

function showLoading() {
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = `<div class="bot-avatar">🤖</div><div class="message-content"><div class="loading"><span></span><span></span><span></span></div></div>`;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingId;
}

function removeLoading(loadingId) {
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();
}

const fallbackKnowledge = {
    'firewall': `## Firewall Concepts\n\nA **firewall** is a network security system that monitors and controls traffic.\n\n### Types:\n1. **Packet Filtering**: Examines individual packets\n2. **Stateful Inspection**: Tracks connection state\n3. **Application Layer**: Proxy-based filtering\n4. **NGFW**: Next-Gen with IPS/Deep Packet Inspection\n\n### Best Practices:\n- Deny-by-default policy\n- Least privilege principles\n- Regular rule updates`,
    'network security': `## Network Security\n\nProtecting infrastructure from unauthorized access.\n\n### Core Components:\n- **Access Control**: Strong authentication\n- **Encryption**: TLS/SSL for data in transit\n- **IDS/IPS**: Detection and prevention\n- **VPN**: Secure remote access\n- **Segmentation**: Divide into security zones`,
    'penetration testing': `## Penetration Testing\n\nAuthorized simulated cyber attacks to evaluate security.\n\n### Phases:\n1. **Reconnaissance**: Gather information\n2. **Scanning**: Identify ports/services\n3. **Enumeration**: Extract detailed info\n4. **Exploitation**: Attempt access\n5. **Post-Exploitation**: Maintain access\n6. **Reporting**: Document findings`,
    'sql injection': `## SQL Injection\n\nCode injection technique targeting databases.\n\n### Prevention:\n\`\`\`sql\n-- Vulnerable\nSELECT * FROM users WHERE name = '$name'\n\n-- Secure\nSELECT * FROM users WHERE name = ?\n\`\`\`\n\n### Best Practices:\n- Parameterized queries\n- Input validation\n- Least privilege DB accounts`,
    'xss': `## Cross-Site Scripting (XSS)\n\nInjects malicious scripts into web pages.\n\n### Types:\n1. **Stored XSS**: Persists on server\n2. **Reflected**: Via URL parameters\n3. **DOM-based**: Client-side manipulation\n\n### Prevention:\n- Input sanitization\n- Output encoding\n- Content Security Policy (CSP)`,
    'phishing': `## Phishing Defense\n\nSocial engineering attack to steal information.\n\n### Types:\n- Email phishing\n- Spear phishing (targeted)\n- Whaling (C-level)\n- Smishing (SMS)\n- Vishing (voice)\n\n### Prevention:\n- Check sender domain\n- Don't click suspicious links\n- Enable MFA`,
    'ransomware': `## Ransomware Protection\n\nEncrypts files and demands payment.\n\n### Attack Vectors:\n- Phishing emails\n- Exploit kits\n- RDP attacks\n\n### Prevention:\n1. **Backup**: 3-2-1 rule\n2. **Technical**: Email filtering, patching\n3. **Access**: Least privilege`
};

function generateFallbackResponse(message) {
    const lower = message.toLowerCase();
    for (const [keyword, response] of Object.entries(fallbackKnowledge)) {
        if (lower.includes(keyword)) return response;
    }
    if (lower.includes('protect') || lower.includes('security best')) {
        return `## Security Best Practices\n\n### For Individuals:\n- Strong unique passwords + password manager\n- Enable MFA everywhere\n- Keep software updated\n\n### For Organizations:\n1. Zero Trust Architecture\n2. Network Segmentation\n3. Least Privilege Access`;
    }
    return `## CyberSage Assistant\n\nI'm specialized in:\n- Network Security\n- Ethical Hacking & Pen Testing\n- Web Application Security\n- Incident Response\n- Compliance\n\nAsk me about cybersecurity topics!`;
}
