// API Configuration for OpenRouter
const API_CONFIG = {
    // OpenRouter API endpoint
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    
    // OpenRouter API Key
    apiKey: 'sk-or-v1-317b3fe8c3c3d6e4d3e2c3e7c0b9c7e4d3e2c3e7c0b9c7e4d3e2c3e7',  // کلید API پیش‌فرض برای همه کاربران
    
    // Model settings - Can be changed by model selector
    model: 'google/gemini-2.0-flash-exp:free',
    
    // Default settings
    temperature: 0.7,
    stream: false,
    
    // System message
    systemMessage: 'You are VX, a helpful AI assistant.',
    
    // OpenRouter specific settings
    siteName: 'VX Chat',
    siteUrl: window.location.origin || 'https://vx-chat.local'
};

// Load model from localStorage if user changed it
function loadSettings() {
    const savedModel = localStorage.getItem('vx_model');
    if (savedModel) {
        API_CONFIG.model = savedModel;
    }
}

// Initialize
loadSettings();
