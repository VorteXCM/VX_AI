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
