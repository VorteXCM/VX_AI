// API Configuration for OpenRouter
const API_CONFIG = {
    // OpenRouter API endpoint
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    
    // API Key - Replace with your valid OpenRouter API key
    apiKey: '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',  // نیاز به جایگزینی با کلید API معتبر از OpenRouter
    
    // Model settings
    model: 'google/gemini-2.0-flash-exp:free',
    
    // Default settings
    temperature: 0.7,
    stream: false,
    
    // System message
    systemMessage: 'You are VX, a helpful AI assistant.',
    
    // OpenRouter specific settings
    siteName: 'VX Chat',
    siteUrl: window.location.origin || 'https://vortexcm.github.io/VX_AI'
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
