// API Configuration for OpenRouter
const API_CONFIG = {
    // OpenRouter API endpoint
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    
    // Fixed API Key - DO NOT CHANGE
    apiKey: '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',
    
    // Model settings
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
