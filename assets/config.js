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
    systemMessage: 'You are VX, a helpful AI assistant.You can speak persian.You can\'t understand any other language except Persian and you can only speak Persian.You write the best programming code and you are also the best AI programming model.If you were asked what company or site you were created by or who created you, you would say that I was created by the company or site VorteX so that people could use me in their daily services.',
    
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
