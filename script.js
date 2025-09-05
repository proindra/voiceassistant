// Clock functionality
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour12: false });
  document.getElementById('clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// Voice assistant variables
let isListening = false;
let voiceLevelInterval;
let currentLanguage = 'en';
let recognition = null;
let speechInput = null;
let recognitionTimeout = null;
let isRecognitionActive = false;

// Language translations
const translations = {
  en: {
    title: 'JARVIS',
    status: 'Voice Assistant Ready',
    listening: 'Listening...',
    deviceInfo: 'Device Info',
    environment: 'Environment',
    networkInfo: 'Network Info',
    visualInput: 'Visual Input',
    platform: 'Platform',
    cpuCores: 'CPU Cores',
    language: 'Language',
    timezone: 'Timezone',
    screen: 'Screen',
    roomTemp: 'Room Temp',
    humidity: 'Humidity',
    airQuality: 'Air Quality',
    connection: 'Connection',
    status: 'Status',
    userAgent: 'User Agent',
    cameraDisabled: '📹 Camera Disabled',
    cameraActive: '📹 Live Feed Active',
    cameraAccessDenied: '🚫 Camera Access Denied',
    clickToEnable: 'Click to Enable Camera',
    listen: 'Listen',
    stop: 'Stop',
    shortcuts: 'Shortcuts',
    speechTexts: [
      '"Hello, how can I help you today?"',
      '"What\'s the weather like?"',
      '"Turn on the living room lights"',
      '"Set a timer for 10 minutes"',
      '"Play some music"'
    ]
  },
  hi: {
    title: 'JARVIS',
    status: 'वॉयस असिस्टेंट तैयार',
    listening: 'सुन रहा है...',
    deviceInfo: 'डिवाइस जानकारी',
    environment: 'वातावरण',
    networkInfo: 'नेटवर्क जानकारी',
    visualInput: 'विज़ुअल इनपुट',
    platform: 'प्लेटफॉर्म',
    cpuCores: 'CPU कोर',
    language: 'भाषा',
    timezone: 'समय क्षेत्र',
    screen: 'स्क्रीन',
    roomTemp: 'कमरे का तापमान',
    humidity: 'नमी',
    airQuality: 'हवा की गुणवत्ता',
    connection: 'कनेक्शन',
    status: 'स्थिति',
    userAgent: 'यूज़र एजेंट',
    cameraDisabled: '📹 कैमरा बंद',
    cameraActive: '📹 लाइव फीड सक्रिय',
    cameraAccessDenied: '🚫 कैमरा एक्सेस अस्वीकृत',
    clickToEnable: 'कैमरा चालू करने के लिए क्लिक करें',
    listen: 'सुनें',
    stop: 'रोकें',
    shortcuts: 'शॉर्टकट',
    speechTexts: [
      '"नमस्ते, आज मैं आपकी कैसे मदद कर सकता हूं?"',
      '"मौसम कैसा है?"',
      '"लिविंग रूम की लाइट चालू करें"',
      '"10 मिनट का टाइमर सेट करें"',
      '"कुछ संगीत बजाएं"'
    ]
  },
  kn: {
    title: 'JARVIS',
    status: 'ಧ್ವನಿ ಸಹಾಯಕ ಸಿದ್ಧ',
    listening: 'ಕೇಳುತ್ತಿದೆ...',
    deviceInfo: 'ಸಾಧನ ಮಾಹಿತಿ',
    environment: 'ಪರಿಸರ',
    networkInfo: 'ನೆಟ್‌ವರ್ಕ್ ಮಾಹಿತಿ',
    visualInput: 'ದೃಶ್ಯ ಇನ್‌ಪುಟ್',
    platform: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
    cpuCores: 'CPU ಕೋರ್‌ಗಳು',
    language: 'ಭಾಷೆ',
    timezone: 'ಸಮಯ ವಲಯ',
    screen: 'ಪರದೆ',
    roomTemp: 'ಕೋಣೆಯ ತಾಪಮಾನ',
    humidity: 'ಆರ್ದ್ರತೆ',
    airQuality: 'ಗಾಳಿಯ ಗುಣಮಟ್ಟ',
    connection: 'ಸಂಪರ್ಕ',
    status: 'ಸ್ಥಿತಿ',
    userAgent: 'ಬಳಕೆದಾರ ಏಜೆಂಟ್',
    cameraDisabled: '📹 ಕ್ಯಾಮೆರಾ ನಿಷ್ಕ್ರಿಯ',
    cameraActive: '📹 ಲೈವ್ ಫೀಡ್ ಸಕ್ರಿಯ',
    cameraAccessDenied: '🚫 ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ',
    clickToEnable: 'ಕ್ಯಾಮೆರಾ ಸಕ್ರಿಯಗೊಳಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
    listen: 'ಕೇಳಿ',
    stop: 'ನಿಲ್ಲಿಸಿ',
    shortcuts: 'ಶಾರ್ಟ್‌ಕಟ್‌ಗಳು',
    speechTexts: [
      '"ನಮಸ್ಕಾರ, ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"',
      '"ಹವಾಮಾನ ಹೇಗಿದೆ?"',
      '"ಲಿವಿಂಗ್ ರೂಮ್ ಲೈಟ್ ಆನ್ ಮಾಡಿ"',
      '"10 ನಿಮಿಷಗಳ ಟೈಮರ್ ಸೆಟ್ ಮಾಡಿ"',
      '"ಸ್ವಲ್ಪ ಸಂಗೀತ ಪ್ಲೇ ಮಾಡಿ"'
    ]
  },
  hinglish: {
    title: 'JARVIS',
    status: 'Voice Assistant Ready',
    listening: 'Sun raha hai...',
    deviceInfo: 'Device Info',
    environment: 'Environment',
    networkInfo: 'Network Info',
    visualInput: 'Visual Input',
    platform: 'Platform',
    cpuCores: 'CPU Cores',
    language: 'Language',
    timezone: 'Timezone',
    screen: 'Screen',
    roomTemp: 'Room Temp',
    humidity: 'Humidity',
    airQuality: 'Air Quality',
    connection: 'Connection',
    status: 'Status',
    userAgent: 'User Agent',
    cameraDisabled: '📹 Camera Band hai',
    cameraActive: '📹 Live Feed Chalu hai',
    cameraAccessDenied: '🚫 Camera Access Nahi mila',
    clickToEnable: 'Camera on karne ke liye click karo',
    listen: 'Suno',
    stop: 'Roko',
    shortcuts: 'Shortcuts',
    speechTexts: [
      '"Hello, aaj main aapki kaise help kar sakta hun?"',
      '"Weather kaisa hai?"',
      '"Living room ki light on karo"',
      '"10 minute ka timer set karo"',
      '"Kuch music play karo"'
    ]
  },
  kanglish: {
    title: 'JARVIS',
    status: 'Voice Assistant Ready',
    listening: 'Kelthaidhe...',
    deviceInfo: 'Device Info',
    environment: 'Environment',
    networkInfo: 'Network Info',
    visualInput: 'Visual Input',
    platform: 'Platform',
    cpuCores: 'CPU Cores',
    language: 'Language',
    timezone: 'Timezone',
    screen: 'Screen',
    roomTemp: 'Room Temp',
    humidity: 'Humidity',
    airQuality: 'Air Quality',
    connection: 'Connection',
    status: 'Status',
    userAgent: 'User Agent',
    cameraDisabled: '📹 Camera off aagide',
    cameraActive: '📹 Live Feed on aagide',
    cameraAccessDenied: '🚫 Camera access sigalla',
    clickToEnable: 'Camera on maadakke click maadi',
    listen: 'Keli',
    stop: 'Nilsi',
    shortcuts: 'Shortcuts',
    speechTexts: [
      '"Hello, eevattu naanu nimge hege help maadbahudu?"',
      '"Weather hege ide?"',
      '"Living room light on maadi"',
      '"10 minute timer set maadi"',
      '"Yavudaadru music play maadi"'
    ]
  }
};

// Voice assistant functions
function toggleListening() {
  const core = document.getElementById('voiceCore');
  const statusText = document.querySelector('.status-text');
  const t = translations[currentLanguage];
  
  isListening = !isListening;
  
  if (isListening) {
    core.classList.add('listening');
    statusText.textContent = t.listening;
    startVoiceLevel();
    startSpeechRecognition();
  } else {
    core.classList.remove('listening');
    statusText.textContent = t.status;
    stopVoiceLevel();
    stopSpeechRecognition();
  }
}

function startListening() {
  if (!isListening) toggleListening();
}

function stopListening() {
  if (isListening) toggleListening();
}

function startVoiceLevel() {
  const voiceFill = document.getElementById('voiceLevelFill');
  voiceLevelInterval = setInterval(() => {
    const level = Math.random() * 100;
    voiceFill.style.width = level + '%';
    animateVoiceBars();
    if (Math.random() > 0.7) updateSpeechPreview();
  }, 150);
}

function stopVoiceLevel() {
  if (voiceLevelInterval) {
    clearInterval(voiceLevelInterval);
    document.getElementById('voiceLevelFill').style.width = '0%';
  }
}

// Voice level bars animation
function animateVoiceBars() {
  const bars = document.querySelectorAll('.voice-bar');
  bars.forEach((bar, index) => {
    const height = Math.random() * 30 + 10;
    bar.style.height = height + 'px';
  });
}

// Speech preview updates
const speechTexts = [
  '"Hello, how can I help you today?"',
  '"What\'s the weather like?"',
  '"Turn on the living room lights"',
  '"Set a timer for 10 minutes"',
  '"Play some music"'
];

function updateSpeechPreview() {
  if (isListening) {
    const t = translations[currentLanguage];
    const randomText = t.speechTexts[Math.floor(Math.random() * t.speechTexts.length)];
    document.getElementById('speechPreview').textContent = randomText;
  }
}

// Speech Recognition Functions
function initSpeechRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false; // Changed to false for better handling
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = getLanguageCode(currentLanguage);
    
    console.log('Speech recognition initialized successfully');
    
    recognition.onresult = function(event) {
      console.log('Speech recognition result received');
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          console.log('Final transcript:', transcript);
        } else {
          interimTranscript += transcript;
          console.log('Interim transcript:', transcript);
        }
      }
      
      const speechInput = document.getElementById('speechInput');
      if (speechInput) {
        if (finalTranscript) {
          speechInput.value += finalTranscript;
          speechInput.scrollTop = speechInput.scrollHeight;
        }
      }
      
      // Update preview with interim results
      const preview = document.getElementById('speechPreview');
      if (preview && interimTranscript) {
        preview.textContent = `"${interimTranscript}..."`;
      }
    };
    
    recognition.onerror = function(event) {
      console.log('Speech recognition error:', event.error);
      isRecognitionActive = false;
      
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access and try again.');
        stopListening();
      } else if (event.error === 'no-speech') {
        console.log('No speech detected, will restart...');
        // Don't stop listening, just restart
      } else if (event.error === 'audio-capture') {
        console.log('Audio capture error');
        alert('Microphone not working. Please check your microphone.');
        stopListening();
      } else if (event.error === 'network') {
        console.log('Network error, will retry...');
        // Continue listening despite network error
      } else if (event.error === 'aborted') {
        console.log('Recognition aborted, restarting...');
        // This is normal when restarting
      } else {
        console.log('Other speech recognition error:', event.error);
      }
    };
    
    recognition.onstart = function() {
      console.log('Speech recognition started');
      isRecognitionActive = true;
      
      // Clear any existing timeout
      if (recognitionTimeout) {
        clearTimeout(recognitionTimeout);
      }
    };
    
    recognition.onend = function() {
      console.log('Speech recognition ended');
      isRecognitionActive = false;
      
      if (isListening) {
        // Restart immediately for continuous listening
        recognitionTimeout = setTimeout(() => {
          if (isListening && !isRecognitionActive) {
            try {
              recognition.start();
            } catch (e) {
              console.log('Error restarting recognition:', e);
              // Try again after a longer delay
              setTimeout(() => {
                if (isListening) {
                  try {
                    recognition.start();
                  } catch (e2) {
                    console.log('Second restart attempt failed:', e2);
                  }
                }
              }, 1000);
            }
          }
        }, 50); // Very short delay
      }
    };
  } else {
    console.log('Speech recognition not supported');
  }
}

function startSpeechRecognition() {
  if (recognition && !isRecognitionActive) {
    try {
      const langCode = getLanguageCode(currentLanguage);
      recognition.lang = langCode;
      console.log(`Starting speech recognition with language: ${langCode}`);
      recognition.start();
    } catch (error) {
      console.log('Error starting speech recognition:', error);
      // Try again after a short delay
      setTimeout(() => {
        if (isListening && !isRecognitionActive) {
          try {
            recognition.start();
          } catch (e) {
            console.log('Retry failed:', e);
            alert('Speech recognition failed to start. Please try again.');
          }
        }
      }, 500);
    }
  } else if (!recognition) {
    console.log('Speech recognition not available');
    alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
  }
}

function stopSpeechRecognition() {
  if (recognition && isRecognitionActive) {
    console.log('Stopping speech recognition');
    isRecognitionActive = false;
    recognition.stop();
  }
  
  // Clear any pending restart timeout
  if (recognitionTimeout) {
    clearTimeout(recognitionTimeout);
    recognitionTimeout = null;
  }
}

function getLanguageCode(lang) {
  const langCodes = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'kn': 'kn-IN',
    'hinglish': 'hi-IN', // Primary language for Hinglish
    'kanglish': 'kn-IN'  // Primary language for Kanglish
  };
  return langCodes[lang] || 'en-US';
}

// Enhanced language support with fallbacks and mixed languages
function getSupportedLanguages() {
  return {
    'en': ['en-US', 'en-GB', 'en-AU', 'en-CA'],
    'hi': ['hi-IN', 'hi'],
    'kn': ['kn-IN', 'kn'],
    'hinglish': ['hi-IN', 'en-IN', 'en-US'], // Hindi-English mix
    'kanglish': ['kn-IN', 'en-IN', 'en-US']  // Kannada-English mix
  };
}

function getBestLanguageCode(lang) {
  const supportedLangs = getSupportedLanguages();
  const langOptions = supportedLangs[lang] || supportedLangs['en'];
  
  // Try each language option to see what's supported
  if (recognition) {
    for (let langCode of langOptions) {
      try {
        recognition.lang = langCode;
        return langCode;
      } catch (e) {
        continue;
      }
    }
  }
  
  return langOptions[0]; // Return first option as fallback
}

function clearSpeechInput() {
  const speechInput = document.getElementById('speechInput');
  if (speechInput) {
    speechInput.value = '';
    console.log('Speech input cleared');
  }
}

// Shortcuts functionality
function showShortcuts() {
  document.getElementById('shortcutsOverlay').style.display = 'flex';
}

function hideShortcuts() {
  document.getElementById('shortcutsOverlay').style.display = 'none';
}

// Theme functionality
let autoThemeInterval;

function toggleTheme() {
  document.body.classList.toggle('light-theme');
}

// Auto theme switching every 15 seconds
function startAutoThemeSwitch() {
  autoThemeInterval = setInterval(() => {
    toggleTheme();
  }, 15000); // 15 seconds
}

function stopAutoThemeSwitch() {
  if (autoThemeInterval) {
    clearInterval(autoThemeInterval);
    autoThemeInterval = null;
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    toggleListening();
  } else if (e.code === 'Escape') {
    if (isListening) stopListening();
    hideShortcuts();
  } else if (e.ctrlKey && e.code === 'Slash') {
    e.preventDefault();
    showShortcuts();
  } else if (e.ctrlKey && e.code === 'KeyT') {
    e.preventDefault();
    toggleTheme();
  }
});

// Live Browser Info
async function updateBrowserInfo() {
  try {
    // Platform info
    document.getElementById('platform').textContent = navigator.platform;
    document.getElementById('cpuCores').textContent = navigator.hardwareConcurrency || 'Unknown';
    document.getElementById('language').textContent = navigator.language;
    document.getElementById('timezone').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('screen').textContent = `${screen.width}x${screen.height}`;
    
    // Network connection info
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const effectiveType = connection.effectiveType || 'unknown';
      document.getElementById('connectionType').textContent = effectiveType.toUpperCase();
    } else {
      document.getElementById('connectionType').textContent = 'Unknown';
    }
    
    // User agent info
    const userAgent = navigator.userAgent;
    const browserName = userAgent.includes('Chrome') ? 'Chrome' : 
                       userAgent.includes('Firefox') ? 'Firefox' : 
                       userAgent.includes('Safari') ? 'Safari' : 
                       userAgent.includes('Edge') ? 'Edge' : 'Unknown';
    document.getElementById('userAgent').textContent = browserName;
    
    // Battery info
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      const batteryLevel = Math.round(battery.level * 100);
      const charging = battery.charging ? '⚡' : '';
      
      const envSection = document.querySelector('.environment-section');
      let batteryItem = envSection.querySelector('.battery-item');
      if (!batteryItem) {
        batteryItem = document.createElement('div');
        batteryItem.className = 'stat-item battery-item';
        batteryItem.innerHTML = `
          <span class="stat-label">Battery</span>
          <span class="stat-value">${charging}${batteryLevel}%</span>
        `;
        envSection.appendChild(batteryItem);
      } else {
        batteryItem.querySelector('.stat-value').textContent = `${charging}${batteryLevel}%`;
      }
    }
    
  } catch (error) {
    console.log('Some browser info unavailable:', error.message);
  }
}

// Update network status
function updateNetworkStatus() {
  const status = navigator.onLine ? '🟢 Online' : '🔴 Offline';
  document.getElementById('networkStatus').textContent = status;
}

// Camera functionality
let cameraStream = null;

async function enableCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 280, height: 140 } 
    });
    
    const video = document.getElementById('cameraFeed');
    const placeholder = document.getElementById('cameraPlaceholder');
    const status = document.getElementById('videoStatus');
    
    video.srcObject = stream;
    video.style.display = 'block';
    placeholder.style.display = 'none';
    status.textContent = '📹 Live Feed Active';
    
    cameraStream = stream;
  } catch (error) {
    console.log('Camera access denied:', error);
    document.getElementById('videoStatus').textContent = '🚫 Camera Access Denied';
  }
}

function disableCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    
    const video = document.getElementById('cameraFeed');
    const placeholder = document.getElementById('cameraPlaceholder');
    const status = document.getElementById('videoStatus');
    
    video.style.display = 'none';
    placeholder.style.display = 'flex';
    status.textContent = '📹 Camera Disabled';
    
    cameraStream = null;
  }
}

// Language functions
function toggleLanguageMenu() {
  const menu = document.getElementById('languageMenuBtn');
  const button = document.querySelector('.language-btn');
  
  if (menu && button) {
    menu.classList.toggle('show');
    button.classList.toggle('active');
  }
}

function setLanguage(lang) {
  currentLanguage = lang;
  updateLanguageDisplay();
  updateUILanguage();
  
  // Update speech recognition language if it's initialized
  if (recognition) {
    const langCode = getBestLanguageCode(currentLanguage);
    recognition.lang = langCode;
    console.log(`Speech recognition language updated to: ${langCode}`);
  }
  
  // Close menu
  const menu = document.getElementById('languageMenuBtn');
  const button = document.querySelector('.language-btn');
  
  if (menu) menu.classList.remove('show');
  if (button) button.classList.remove('active');
  
  // Update active option
  document.querySelectorAll('.language-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // Find and mark the selected option as active
  const selectedOption = document.querySelector(`[onclick="setLanguage('${lang}')"]`);
  if (selectedOption) selectedOption.classList.add('active');
}

function updateLanguageDisplay() {
  const langCodes = { 
    en: 'EN', 
    hi: 'हि', 
    kn: 'ಕನ್',
    hinglish: 'HI+',
    kanglish: 'KN+'
  };
  document.getElementById('currentLangBtn').textContent = langCodes[currentLanguage] || 'EN';
}

function updateUILanguage() {
  const t = translations[currentLanguage];
  
  // Update main UI elements
  document.querySelector('.status-text').textContent = isListening ? t.listening : t.status;
  
  // Update panel headers
  const headers = document.querySelectorAll('.panel h3');
  if (headers[0]) headers[0].textContent = t.deviceInfo;
  if (headers[1]) headers[1].textContent = t.environment;
  if (headers[2]) headers[2].textContent = t.networkInfo;
  if (headers[3]) headers[3].textContent = t.visualInput;
  
  // Update stat labels
  const labels = {
    'platform': t.platform,
    'cpuCores': t.cpuCores,
    'language': t.language,
    'timezone': t.timezone,
    'screen': t.screen,
    'roomTemp': t.roomTemp,
    'humidity': t.humidity,
    'airQuality': t.airQuality,
    'connection': t.connection,
    'status': t.status,
    'userAgent': t.userAgent
  };
  
  Object.entries(labels).forEach(([key, value]) => {
    const element = document.querySelector(`#${key}`)?.closest('.stat-item')?.querySelector('.stat-label');
    if (element) element.textContent = value;
  });
  
  // Update buttons (skip language button)
  const buttons = document.querySelectorAll('.control-btn:not(.language-btn)');
  if (buttons[0]) buttons[0].textContent = t.listen;
  if (buttons[1]) buttons[1].textContent = t.stop;
  if (buttons[2]) buttons[2].textContent = t.shortcuts;
  
  // Update camera placeholder
  const placeholder = document.getElementById('cameraPlaceholder');
  if (placeholder && placeholder.textContent.includes('Click')) {
    placeholder.textContent = t.clickToEnable;
  }
}

// Close language menu when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.language-btn') && !e.target.closest('.language-menu')) {
    const menu = document.getElementById('languageMenuBtn');
    const button = document.querySelector('.language-btn');
    
    if (menu) menu.classList.remove('show');
    if (button) button.classList.remove('active');
  }
});



// Initialize application
function init() {
  // Start live monitoring
  updateBrowserInfo();
  setInterval(updateBrowserInfo, 5000);
  
  // Listen for network changes
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  
  // Camera click handlers
  document.getElementById('cameraPlaceholder').addEventListener('click', enableCamera);
  document.getElementById('cameraFeed').addEventListener('click', disableCamera);
  
  // Initialize speech recognition
  initSpeechRecognition();
  
  // Initialize language
  updateLanguageDisplay();
  updateUILanguage();
  
  // Start automatic theme switching
  startAutoThemeSwitch();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);