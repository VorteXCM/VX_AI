// API Handler for VX with OpenRouter

class VXApi {
    constructor() {
        this.conversationHistory = [];
    }

    // Send message to API
    async sendMessage(userMessage) {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            // Prepare messages array
            const messages = [
                {
                    role: 'system',
                    content: API_CONFIG.systemMessage
                },
                ...this.conversationHistory
            ];

            // Prepare headers for OpenRouter
            const apiKey = API_CONFIG.apiKey;
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': API_CONFIG.siteUrl || window.location.origin,
                'X-Title': API_CONFIG.siteName || 'VX Chat'
            };

            // Prepare request body
            const requestBody = {
                model: API_CONFIG.model,
                messages: messages,
                temperature: API_CONFIG.temperature
            };

            // Add stream if enabled
            if (API_CONFIG.stream) {
                requestBody.stream = true;
            }

            // Make API request
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                let errorMessage = 'API request failed';
                try {
                    const error = await response.json();
                    errorMessage = error.error?.message || error.message || `HTTP ${response.status}: ${response.statusText}`;
                } catch (e) {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                
                // Add helpful messages for common errors
                if (response.status === 404) {
                    errorMessage = 'مدل انتخاب شده نامعتبر است. لطفاً با مدیر سیستم تماس بگیرید.';
                } else if (response.status === 401 || response.status === 403) {
                    if (!API_CONFIG.apiKey) {
                        errorMessage = 'کلید API در فایل config.js تنظیم نشده است. لطفاً با مدیر سیستم تماس بگیرید.';
                    } else {
                        errorMessage = 'کلید API نامعتبر است یا منقضی شده است. لطفاً با مدیر سیستم تماس بگیرید.';
                    }
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Extract assistant's response
            const assistantMessage = data.choices[0].message.content;

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            return {
                success: true,
                message: assistantMessage,
                data: data
            };

        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Clear conversation history
    clearHistory() {
        this.conversationHistory = [];
    }

    // Get conversation history
    getHistory() {
        return this.conversationHistory;
    }

    // Set system message
    setSystemMessage(message) {
        API_CONFIG.systemMessage = message;
    }

    // Generate image using Pollinations.ai (Free, no API key needed)
    async generateImage(prompt) {
        console.log('%c🎨 IMAGE GENERATION STARTED', 'color: #ef4444; font-weight: bold; font-size: 14px;');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        try {
            console.log('📝 Original Prompt:', prompt);
            
            // Clean and encode the prompt
            const encodedPrompt = encodeURIComponent(prompt);
            console.log('🔗 Encoded Prompt:', encodedPrompt);
            
            // Generate unique seed for different results each time
            const seed = Math.floor(Math.random() * 1000000);
            console.log('🎲 Random Seed:', seed);
            
            // Generate image URL with parameters
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;
            
            console.log('🌐 Generated URL:', imageUrl);
            console.log('%c✅ Image URL created successfully!', 'color: #22c55e; font-weight: bold;');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('💡 TIP: The image will load in the browser. Check Network tab if it fails.');
            console.log('');
            
            // Return immediately - the image will load in the browser
            return {
                success: true,
                imageUrl: imageUrl,
                prompt: prompt
            };

        } catch (error) {
            console.log('%c❌ IMAGE GENERATION FAILED', 'color: #ef4444; font-weight: bold; font-size: 14px;');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('🔴 Error Details:', error);
            console.log('');
            console.log('%c🔧 TROUBLESHOOTING STEPS:', 'color: #fbbf24; font-weight: bold;');
            console.log('1️⃣  Check your internet connection');
            console.log('2️⃣  Make sure the prompt is not empty');
            console.log('3️⃣  Try using English prompts for better results');
            console.log('4️⃣  Check browser console for CORS errors');
            console.log('5️⃣  Try refreshing the page and retry');
            console.log('');
            console.log('%c📋 ERROR TYPE:', 'color: #ef4444; font-weight: bold;');
            console.log('   ', error.name);
            console.log('%c📝 ERROR MESSAGE:', 'color: #ef4444; font-weight: bold;');
            console.log('   ', error.message);
            console.log('%c📍 ERROR STACK:', 'color: #ef4444; font-weight: bold;');
            console.log(error.stack);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
            
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Create global instance
const vxApi = new VXApi();
