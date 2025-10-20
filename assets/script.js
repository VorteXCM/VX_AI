// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const collapseBtn = document.getElementById('collapseBtn');
let sidebarExpanded = false;

// Check for query parameters on page load
document.addEventListener('DOMContentLoaded', function() {
    // Parse URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const queryMessage = urlParams.get('message');
    const chatId = urlParams.get('chat');
    
    // If there's a message in the query, send it automatically
    if (queryMessage) {
        // Make sure the chat interface is visible
        showChatInterface();
        // Set the message in the input field
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = decodeURIComponent(queryMessage);
            // Optional: Auto-send the message
            setTimeout(() => {
                document.getElementById('sendButton').click();
            }, 500);
        }
    }
    
    // If there's a chat ID, load that specific chat
    if (chatId) {
        loadChatFromUrl();
    }
});

// Function to toggle sidebar
function toggleSidebar() {
    sidebarExpanded = !sidebarExpanded;
    sidebar.classList.toggle('expanded');
}

// Collapse button click to toggle
collapseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
});

// Sidebar hover to expand (only when collapsed)
sidebar.addEventListener('mouseenter', () => {
    if (!sidebarExpanded) {
        sidebar.classList.add('expanded');
    }
});

sidebar.addEventListener('mouseleave', () => {
    if (!sidebarExpanded) {
        sidebar.classList.remove('expanded');
    }
});

// Search Modal functionality
const searchModalOverlay = document.getElementById('searchModalOverlay');
const searchModal = document.getElementById('searchModal');
const searchBtn = document.getElementById('searchBtn');
const searchModalClose = document.getElementById('searchModalClose');
const searchModalInput = document.getElementById('searchModalInput');
const privateChatsContainer = document.getElementById('privateChatsContainer');
const createPrivateChatBtn = document.getElementById('createPrivateChatBtn');
const clearPrivateChatsBtn = document.getElementById('clearPrivateChatsBtn');

// Show chat preview
function showChatPreview(chatId) {
    const chat = chatManager.privateChats.find(c => c.id === chatId);
    if (!chat) return;
    
    const previewContent = document.getElementById('previewContent');
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    const previewTitle = document.getElementById('previewTitle');
    const previewMessages = document.getElementById('previewMessages');
    
    previewPlaceholder.style.display = 'none';
    previewContent.style.display = 'block';
    
    previewTitle.textContent = chat.title;
    
    // Show messages
    let messagesHtml = '';
    chat.messages.forEach(msg => {
        if (msg.role === 'user') {
            messagesHtml += `
                <div class="preview-message user">
                    <div class="preview-bubble">${msg.content}</div>
                </div>
            `;
        } else {
            if (msg.isImage && msg.content) {
                messagesHtml += `
                    <div class="preview-message assistant">
                        <div class="preview-text">
                            <img src="${msg.content}" alt="Image" style="max-width: 200px; border-radius: 8px; margin: 4px 0;" />
                        </div>
                    </div>
                `;
            } else {
                messagesHtml += `
                    <div class="preview-message assistant">
                        <div class="preview-text">${msg.content}</div>
                    </div>
                `;
            }
        }
    });
    
    previewMessages.innerHTML = messagesHtml;
    
    // Set up action buttons
    document.getElementById('previewGoBtn').onclick = () => {
        window.location.href = `index.html?chat=${chatId}`;
    };
    
    document.getElementById('previewDeleteBtn').onclick = () => {
        if (confirm('Delete this private chat?')) {
            chatManager.deleteChat(chatId);
            loadPrivateChats();
            previewContent.style.display = 'none';
            previewPlaceholder.style.display = 'flex';
        }
    };
}

// Load private chats in search modal
function loadPrivateChats() {
    const privateChats = chatManager.getAllPrivateChats();
    
    if (privateChats.length === 0) {
        privateChatsContainer.innerHTML = `
            <div class="empty-state" style="padding: 40px 20px;">
                <p style="color: #666; font-size: 14px;">No private chats</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    privateChats.forEach(chat => {
        const preview = chat.messages.length > 0 
            ? chat.messages[0].content.substring(0, 60) + '...'
            : 'No messages';
        
        html += `
            <div class="private-chat-item" data-chat-id="${chat.id}">
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span style="font-size: 14px; font-weight: 500; color: #fff;">${chat.title}</span>
                    </div>
                    <p style="font-size: 13px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${preview}</p>
                </div>
                <button class="delete-private-chat-btn" data-chat-id="${chat.id}" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
    });
    
    privateChatsContainer.innerHTML = html;
    
    // Add hover handlers for preview
    document.querySelectorAll('.private-chat-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const chatId = item.dataset.chatId;
            showChatPreview(chatId);
        });
        
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-private-chat-btn')) {
                const chatId = item.dataset.chatId;
                window.location.href = `index.html?chat=${chatId}`;
            }
        });
    });
    
    document.querySelectorAll('.delete-private-chat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const chatId = btn.dataset.chatId;
            if (confirm('Delete this private chat?')) {
                chatManager.deleteChat(chatId);
                loadPrivateChats();
            }
        });
    });
}

// Open search modal
function openSearchModal() {
    loadPrivateChats();
    searchModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        searchModalInput.focus();
    }, 300);
}

// Close search modal
function closeSearchModal() {
    searchModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Open search modal on button click
searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSearchModal();
});

// Close search modal on close button
searchModalClose.addEventListener('click', () => {
    closeSearchModal();
});

// Close modal when clicking on overlay (outside modal)
searchModalOverlay.addEventListener('click', (e) => {
    if (e.target === searchModalOverlay) {
        closeSearchModal();
    }
});

// Prevent closing when clicking inside modal
searchModal.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Create private chat button
createPrivateChatBtn.addEventListener('click', () => {
    // Start new private chat
    isPrivateMode = true;
    privateBtn.classList.add('active');
    privateNotice.style.display = 'flex';
    searchBox.classList.add('private-mode');
    
    // Clear current chat and show welcome screen
    chatMessages.innerHTML = '';
    const centerContent = document.getElementById('centerContent');
    centerContent.classList.remove('chat-mode');
    chatHeader.style.display = 'none';
    
    // Show action buttons
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.classList.remove('hidden');
    }
    
    vxApi.clearHistory();
    chatManager.currentChatId = null;
    
    closeSearchModal();
});

// Clear all private chats
clearPrivateChatsBtn.addEventListener('click', () => {
    if (confirm('Delete all private chats? This cannot be undone.')) {
        chatManager.clearAllPrivateChats();
        loadPrivateChats();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+K to open
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!searchModalOverlay.classList.contains('active')) {
            openSearchModal();
        }
    }
    // Escape to close
    if (e.key === 'Escape' && searchModalOverlay.classList.contains('active')) {
        closeSearchModal();
    }
});

// Available AI Models
const AI_MODELS = [
    { id: 'openai/gpt-oss-20b:free', name: 'GPT oss 20B', description: 'gpt-oss-20b is an open-weight 21B parameter model released by OpenAI under the Apache 2.0 license. It uses a Mixture-of-Experts (MoE) architecture with 3.6B active parameters per forward pass, optimized for lower-latency inference and deployability on consumer or single-GPU hardware. The model is trained in OpenAI\'s Harmony response format and supports reasoning level configuration, fine-tuning, and agentic capabilities including function calling, tool use, and structured outputs.', badge: 'free' },
    { id: 'google/gemma-3-4b-it:free', name: 'Google Gemma 3 4B', description: 'Gemma 3 introduces multimodality, supporting vision-language input and text outputs. It handles context windows up to 128k tokens, understands over 140 languages, and offers improved math, reasoning, and chat capabilities, including structured outputs and function calling.', badge: 'free' },
    { id: 'google/gemma-3-12b-it:free', name: 'Google Gemma 3 12B', description: 'Gemma 3 introduces multimodality, supporting vision-language input and text outputs. It handles context windows up to 128k tokens, understands over 140 languages, and offers improved math, reasoning, and chat capabilities, including structured outputs and function calling. Gemma 3 12B is the second largest in the family of Gemma 3 models after Gemma 3 27B', badge: 'free' },
    { id: 'google/gemma-3-27b-it:free', name: 'Google Gemma 3 27B', description: 'Gemma 3 introduces multimodality, supporting vision-language input and text outputs. It handles context windows up to 128k tokens, understands over 140 languages, and offers improved math, reasoning, and chat capabilities, including structured outputs and function calling. Gemma 3 27B is Google\'s latest open source model, successor to Gemma 2', badge: 'free' },
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', description: 'Gemini Flash 2.0 offers a significantly faster time to first token (TTFT) compared to Gemini Flash 1.5, while maintaining quality on par with larger models like Gemini Pro 1.5. It introduces notable enhancements in multimodal understanding, coding capabilities, complex instruction following, and function calling. These advancements come together to deliver more seamless and robust agentic experiences.', badge: 'free' }
];

// Chat functionality
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatHeader = document.getElementById('chatHeader');
const chatTitle = document.getElementById('chatTitle');
const sendBtn = document.querySelector('.send-btn');
const newChatBtn = document.getElementById('newChatBtn');
const searchInput = document.querySelector('.search-input');
const searchBox = document.querySelector('.search-box');
let isProcessing = false;
let isPrivateMode = false;
let isImageMode = false;
let typingInterval = null;
let shouldStopTyping = false;

// Model Selector
const modelSelectorBtn = document.getElementById('modelSelectorBtn');
const modelSelectorDropdown = document.getElementById('modelSelectorDropdown');
const modelList = document.getElementById('modelList');
const currentModelName = document.getElementById('currentModelName');

// Initialize model selector
function initModelSelector() {
    // Use default model
    const currentModel = AI_MODELS[0];
    currentModelName.textContent = currentModel.name;
    API_CONFIG.model = currentModel.id;
    
    // Populate model list
    modelList.innerHTML = AI_MODELS.map(model => `
        <div class="model-item ${model.id === API_CONFIG.model ? 'active' : ''}" data-model-id="${model.id}">
            <div class="model-info">
                <div class="model-name">${model.name}</div>
                <div class="model-description">${model.description}</div>
            </div>
            <span class="model-badge ${model.badge}">${model.badge === 'free' ? 'Free' : 'Premium'}</span>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.model-item').forEach(item => {
        item.addEventListener('click', () => {
            const modelId = item.dataset.modelId;
            selectModel(modelId);
        });
    });
}

// Select model
function selectModel(modelId) {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (!model) return;
    
    // Update config
    API_CONFIG.model = model.id;
    
    // Update UI
    currentModelName.textContent = model.name;
    
    // Update active state
    document.querySelectorAll('.model-item').forEach(item => {
        item.classList.toggle('active', item.dataset.modelId === modelId);
    });
    
    // Close dropdown with animation
    modelSelectorDropdown.classList.remove('open');
    modelSelectorBtn.classList.remove('active');
}

// Toggle model selector
modelSelectorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = modelSelectorDropdown.classList.contains('open');
    if (!isOpen) {
        // Ensure it's in the layout for animation
        if (modelSelectorDropdown.style.display !== 'block') {
            modelSelectorDropdown.style.display = 'block';
        }
        requestAnimationFrame(() => {
            modelSelectorDropdown.classList.add('open');
        });
        modelSelectorBtn.classList.add('active');
    } else {
        modelSelectorDropdown.classList.remove('open');
        modelSelectorBtn.classList.remove('active');
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!modelSelectorDropdown.contains(e.target) && !modelSelectorBtn.contains(e.target)) {
        modelSelectorDropdown.classList.remove('open');
        modelSelectorBtn.classList.remove('active');
    }
});

// Initialize on load
initModelSelector();

// Check if loading a specific chat from URL
function loadChatFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat');
    
    if (chatId) {
        const chat = chatManager.switchChat(chatId);
        if (chat) {
            loadExistingChat(chat);
        }
    }
}

// Load existing chat
function loadExistingChat(chat) {
    // Clear current messages
    chatMessages.innerHTML = '';
    
    // Show chat interface
    showChatInterface();
    updateChatTitle(chat.title);
    
    // Load messages without animation
    chat.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.role === 'user' ? 'user' : 'assistant'}`;
        
        if (msg.role === 'user') {
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.textContent = msg.content;
            messageDiv.appendChild(bubble);
        } else {
            const messageText = document.createElement('div');
            messageText.className = 'message-text';
            
            // Check if this is an image message
            if (msg.isImage && msg.content) {
                // Create image container
                const imageContainer = document.createElement('div');
                imageContainer.className = 'generated-image-container';
                imageContainer.innerHTML = `
                    <img src="${msg.content}" alt="Generated image: ${msg.imagePrompt || 'Image'}" class="generated-image" />
                    <div class="image-actions">
                        <a href="${msg.content}" download="generated-image.png" class="image-action-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </a>
                        <button class="image-action-btn" onclick="window.open('${msg.content}', '_blank')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            Open
                        </button>
                    </div>
                `;
                messageText.appendChild(imageContainer);
            } else {
                // Format code blocks for text messages
                const formattedHTML = formatCodeBlocks(msg.content);
                if (formattedHTML !== msg.content) {
                    messageText.innerHTML = formattedHTML;
                } else {
                    messageText.textContent = msg.content;
                }
            }
            
            messageDiv.appendChild(messageText);
            
            // Add copy button
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            const copyBtn = document.createElement('button');
            copyBtn.className = 'message-action-btn copy-btn';
            copyBtn.title = 'Copy';
            copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(msg.content);
            });
            actions.appendChild(copyBtn);
            messageDiv.appendChild(actions);
        }
        
        chatMessages.appendChild(messageDiv);
    });
    
    scrollToBottom();
    
    // Restore conversation history in API
    vxApi.conversationHistory = chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
}

// Function to add message to chat
function addMessage(text, isUser = false, isLoading = false, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'} ${isLoading ? 'loading' : ''}`;
    
    if (isUser) {
        // User message - simple bubble on the right
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        messageDiv.appendChild(bubble);
    } else {
        // Assistant message - text on left with actions below
        const messageText = document.createElement('div');
        messageText.className = isError ? 'error-message' : 'message-text';
        
        if (isLoading) {
            messageText.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        } else {
            messageText.textContent = text;
        }
        
        messageDiv.appendChild(messageText);
        
        if (!isLoading && !isError) {
            // Add copy button for assistant messages
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            const copyBtn = document.createElement('button');
            copyBtn.className = 'message-action-btn copy-btn';
            copyBtn.title = 'Copy';
            copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
            
            // Copy functionality
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        `;
                    }, 2000);
                });
            });
            
            actions.appendChild(copyBtn);
            messageDiv.appendChild(actions);
        }
    }
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

// Function to show chat interface
function showChatInterface() {
    const centerContent = document.getElementById('centerContent');
    centerContent.classList.add('chat-mode');
    chatHeader.style.display = 'flex';
    
    // Hide action buttons when chat starts
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.classList.add('hidden');
    }
}

// Auto scroll to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format code blocks in message
function formatCodeBlocks(text) {
    // Check if text contains code blocks (```language or ```)
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    
    if (!codeBlockRegex.test(text)) {
        return text;
    }
    
    // Reset regex
    codeBlockRegex.lastIndex = 0;
    
    let formattedText = text;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
        const language = match[1] || 'code';
        const code = match[2];
        const codeId = 'code-' + Date.now() + Math.random();
        
        // Escape HTML to prevent rendering
        const escapedCode = code.trim()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        
        const codeBlock = `
            <div class="code-block">
                <div class="code-header">
                    <span class="code-language">${language}</span>
                    <button class="code-copy-btn" onclick="copyCode('${codeId}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                </div>
                <pre id="${codeId}"><code>${escapedCode}</code></pre>
            </div>
        `;
        
        formattedText = formattedText.replace(match[0], codeBlock);
    }
    
    return formattedText;
}

// Copy code function
window.copyCode = function(codeId) {
    const codeElement = document.getElementById(codeId);
    // Get text content (this will automatically decode HTML entities)
    const code = codeElement.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const btn = event.target.closest('.code-copy-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    });
};

// Stop typing function
function stopTyping() {
    shouldStopTyping = true;
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
    }
}

// Parse message into parts (text and code blocks)
function parseMessageParts(text) {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
        // Add text before code block
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex, match.index)
            });
        }
        
        // Add code block
        parts.push({
            type: 'code',
            language: match[1] || 'code',
            content: match[2].trim()
        });
        
        lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
        parts.push({
            type: 'text',
            content: text.substring(lastIndex)
        });
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
}

// Typing animation for AI response with code block support
function typeMessage(element, text, speed = 30) {
    shouldStopTyping = false;
    element.innerHTML = '';
    
    const parts = parseMessageParts(text);
    let partIndex = 0;
    let charIndex = 0;
    let currentElement = null;
    
    return new Promise((resolve) => {
        function typeNextChar() {
            if (shouldStopTyping || partIndex >= parts.length) {
                clearInterval(typingInterval);
                typingInterval = null;
                
                // Show remaining content if stopped
                if (shouldStopTyping) {
                    element.innerHTML = '';
                    parts.forEach(part => {
                        if (part.type === 'text') {
                            const span = document.createElement('span');
                            span.textContent = part.content;
                            element.appendChild(span);
                        } else {
                            element.appendChild(createCodeBlock(part.language, part.content));
                        }
                    });
                }
                
                resolve();
                return;
            }
            
            const currentPart = parts[partIndex];
            
            if (currentPart.type === 'text') {
                if (!currentElement) {
                    currentElement = document.createElement('span');
                    element.appendChild(currentElement);
                }
                
                if (charIndex < currentPart.content.length) {
                    currentElement.textContent += currentPart.content[charIndex];
                    charIndex++;
                    scrollToBottom();
                } else {
                    partIndex++;
                    charIndex = 0;
                    currentElement = null;
                }
            } else if (currentPart.type === 'code') {
                if (!currentElement) {
                    currentElement = createCodeBlock(currentPart.language, '');
                    element.appendChild(currentElement);
                }
                
                const codeElement = currentElement.querySelector('code');
                if (charIndex < currentPart.content.length) {
                    const escapedChar = escapeHtml(currentPart.content[charIndex]);
                    codeElement.innerHTML += escapedChar;
                    charIndex++;
                    scrollToBottom();
                } else {
                    partIndex++;
                    charIndex = 0;
                    currentElement = null;
                }
            }
        }
        
        typingInterval = setInterval(typeNextChar, speed);
    });
}

// Create code block element
function createCodeBlock(language, code) {
    const codeId = 'code-' + Date.now() + '-' + Math.random();
    const div = document.createElement('div');
    div.className = 'code-block';
    
    const escapedCode = escapeHtml(code);
    
    div.innerHTML = `
        <div class="code-header">
            <span class="code-language">${language}</span>
        </div>
        <pre id="${codeId}"><code>${escapedCode}</code></pre>
        <button class="code-copy-btn" onclick="copyCode('${codeId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
        </button>
    `;
    
    return div;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to update chat title
function updateChatTitle(title) {
    chatTitle.textContent = title;
}

// Send message function
async function sendMessage() {
    if (isProcessing) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    // Show chat interface if not already shown
    if (!chatContainer.style.display || chatContainer.style.display === 'none') {
        showChatInterface();
        
        // Set chat title to first message
        if (chatMessages.children.length === 0) {
            updateChatTitle(query.substring(0, 50) + (query.length > 50 ? '...' : ''));
            
            // Save to chat manager
            if (!chatManager.currentChatId) {
                chatManager.createNewChat(query);
            }
        }
    }
    
    // Add user message to UI
    addMessage(query, true);
    
    // Add to chat manager
    chatManager.addMessage('user', query);
    
    searchInput.value = '';
    isProcessing = true;
    
    // Change send button to stop button
    sendBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"></rect>
        </svg>
    `;
    sendBtn.onclick = () => {
        stopTyping();
        // Restore send button
        sendBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
        `;
        sendBtn.onclick = null;
    };
    
    // Add loading message
    const loadingMessage = addMessage('', false, true);
    
    try {
        let response;
        
        // Check if in image mode
        if (isImageMode) {
            // Generate actual image using Pollinations.ai
            response = await vxApi.generateImage(query);
            
            // Remove loading message
            loadingMessage.remove();
            
            if (response.success) {
                // Add image message
                const assistantMsg = addMessage('', false);
                const messageText = assistantMsg.querySelector('.message-text');
                
                // Create image element with loading state
                const imageContainer = document.createElement('div');
                imageContainer.className = 'generated-image-container';
                
                // Create loading placeholder
                const loadingPlaceholder = document.createElement('div');
                loadingPlaceholder.className = 'image-loading';
                loadingPlaceholder.innerHTML = `
                    <div class="loading-spinner"></div>
                    <p>Generating image...</p>
                `;
                imageContainer.appendChild(loadingPlaceholder);
                messageText.appendChild(imageContainer);
                
                // Create image element
                const img = new Image();
                img.className = 'generated-image';
                img.alt = `Generated image: ${response.prompt}`;
                
                // When image loads, replace loading with actual image
                img.onload = () => {
                    console.log('%c✅ IMAGE LOADED SUCCESSFULLY!', 'color: #22c55e; font-weight: bold; font-size: 14px;');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('🖼️  Image URL:', response.imageUrl);
                    console.log('📝 Prompt:', response.prompt);
                    console.log('📐 Image Size:', img.naturalWidth, 'x', img.naturalHeight);
                    console.log('💾 File Size: Check Network tab for details');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('');
                    
                    loadingPlaceholder.remove();
                    imageContainer.innerHTML = `
                        <img src="${response.imageUrl}" alt="Generated image: ${response.prompt}" class="generated-image" />
                        <div class="image-actions">
                            <a href="${response.imageUrl}" download="generated-image.png" class="image-action-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download
                            </a>
                            <button class="image-action-btn" onclick="window.open('${response.imageUrl}', '_blank')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                                Open
                            </button>
                        </div>
                    `;
                };
                
                // If image fails to load, show error
                img.onerror = (error) => {
                    console.log('%c❌ IMAGE LOADING FAILED!', 'color: #ef4444; font-weight: bold; font-size: 14px;');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.error('🔴 Error Event:', error);
                    console.log('🖼️  Failed URL:', response.imageUrl);
                    console.log('📝 Prompt:', response.prompt);
                    console.log('');
                    console.log('%c🔧 POSSIBLE CAUSES & SOLUTIONS:', 'color: #fbbf24; font-weight: bold;');
                    console.log('');
                    console.log('%c1️⃣  NETWORK ISSUE', 'color: #3b82f6; font-weight: bold;');
                    console.log('   ❌ Problem: No internet connection or slow connection');
                    console.log('   ✅ Solution: Check your internet and try again');
                    console.log('');
                    console.log('%c2️⃣  CORS POLICY', 'color: #3b82f6; font-weight: bold;');
                    console.log('   ❌ Problem: Browser blocked the image due to CORS');
                    console.log('   ✅ Solution: This should not happen with Pollinations.ai');
                    console.log('   ✅ Check Network tab for CORS errors');
                    console.log('');
                    console.log('%c3️⃣  INVALID URL', 'color: #3b82f6; font-weight: bold;');
                    console.log('   ❌ Problem: The generated URL is malformed');
                    console.log('   ✅ Solution: Check the URL above and try again');
                    console.log('');
                    console.log('%c4️⃣  SERVICE DOWN', 'color: #3b82f6; font-weight: bold;');
                    console.log('   ❌ Problem: Pollinations.ai service is temporarily down');
                    console.log('   ✅ Solution: Wait a few minutes and try again');
                    console.log('   ✅ Check: https://pollinations.ai/');
                    console.log('');
                    console.log('%c5️⃣  BROWSER ISSUE', 'color: #3b82f6; font-weight: bold;');
                    console.log('   ❌ Problem: Browser cache or extension blocking');
                    console.log('   ✅ Solution: Clear cache or try incognito mode');
                    console.log('   ✅ Disable ad blockers temporarily');
                    console.log('');
                    console.log('%c📊 DEBUGGING STEPS:', 'color: #8b5cf6; font-weight: bold;');
                    console.log('1. Open Network tab (F12 → Network)');
                    console.log('2. Try generating image again');
                    console.log('3. Look for the image request');
                    console.log('4. Check status code (should be 200)');
                    console.log('5. Check response headers');
                    console.log('');
                    console.log('%c🔗 TEST URL MANUALLY:', 'color: #8b5cf6; font-weight: bold;');
                    console.log('Copy this URL and open in new tab:');
                    console.log(response.imageUrl);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('');
                    
                    loadingPlaceholder.remove();
                    imageContainer.innerHTML = `
                        <div class="image-error">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <p>Failed to load image. Check console for details.</p>
                            <button class="image-action-btn" onclick="location.reload()">Retry</button>
                        </div>
                    `;
                };
                
                // Start loading the image
                img.src = response.imageUrl;
                
                // Add to chat manager with image data
                chatManager.addMessage('assistant', response.imageUrl, true, response.prompt);
            } else {
                // Show error
                addMessage(`Error: ${response.error}`, false, false, true);
            }
        } else {
            // Normal text chat
            response = await vxApi.sendMessage(query);
            
            // Remove loading message
            loadingMessage.remove();
            
            if (response.success) {
                // Add assistant response with typing animation
                const assistantMsg = addMessage('', false);
                const messageText = assistantMsg.querySelector('.message-text');
                
                // Type the message
                await typeMessage(messageText, response.message);
                
                // Add to chat manager
                chatManager.addMessage('assistant', response.message);
            } else {
                // Show error
                addMessage(`Error: ${response.error}`, false, false, true);
            }
        }
    } catch (error) {
        loadingMessage.remove();
        addMessage(`Error: ${error.message}`, false, false, true);
    } finally {
        // Restore send button
        sendBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
        `;
        sendBtn.onclick = null;
        isProcessing = false;
    }
}

const privateNotice = document.getElementById('privateNotice');
const imageNotice = document.getElementById('imageNotice');
const createImageBtn = document.getElementById('createImageBtn');

if (privateBtn) {
    privateBtn.addEventListener('click', () => {
        isPrivateMode = !isPrivateMode;
        
        if (isPrivateMode) {
            privateBtn.classList.add('active');
            if (privateNotice) privateNotice.style.display = 'flex';
            searchBox.classList.add('private-mode');
            
            // Disable image mode if active
            if (isImageMode) {
                isImageMode = false;
                if (createImageBtn) createImageBtn.classList.remove('active');
                if (imageNotice) imageNotice.style.display = 'none';
                searchBox.classList.remove('image-mode');
                searchInput.placeholder = 'What do you want to know?';
            }
        } else {
            privateBtn.classList.remove('active');
            if (privateNotice) privateNotice.style.display = 'none';
            searchBox.classList.remove('private-mode');
        }
    });
}

if (createImageBtn) {
    createImageBtn.addEventListener('click', () => {
        isImageMode = !isImageMode;
        
        if (isImageMode) {
            createImageBtn.classList.add('active');
            if (imageNotice) imageNotice.style.display = 'flex';
            searchBox.classList.add('image-mode');
            searchInput.placeholder = 'Describe the image you want to create...';
            
            // Disable private mode if active
            if (isPrivateMode) {
                isPrivateMode = false;
                if (privateBtn) privateBtn.classList.remove('active');
                if (privateNotice) privateNotice.style.display = 'none';
                searchBox.classList.remove('private-mode');
            }
            
            // Hide action buttons
            const actionButtons = document.querySelector('.action-buttons');
            if (actionButtons) {
                actionButtons.classList.add('hidden');
            }
        } else {
            createImageBtn.classList.remove('active');
            if (imageNotice) imageNotice.style.display = 'none';
            searchBox.classList.remove('image-mode');
            searchInput.placeholder = 'What do you want to know?';
            
            // Show action buttons if not in chat mode
            const centerContent = document.getElementById('centerContent');
            if (centerContent && !centerContent.classList.contains('chat-mode')) {
                const actionButtons = document.querySelector('.action-buttons');
                if (actionButtons) {
                    actionButtons.classList.remove('hidden');
                }
            }
        }
    });
}

// New chat button
newChatBtn.addEventListener('click', () => {
    // Clear current chat
    chatMessages.innerHTML = '';
    const centerContent = document.getElementById('centerContent');
    centerContent.classList.remove('chat-mode');
    chatHeader.style.display = 'none';
    
    // Show action buttons again
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.classList.remove('hidden');
    }
    
    // Reset API history
    vxApi.clearHistory();
    
    // Reset current chat ID
    chatManager.currentChatId = null;
    
    // Reset private mode
    isPrivateMode = false;
    privateBtn.classList.remove('active');
    privateNotice.style.display = 'none';
    searchBox.classList.remove('private-mode');
    
    // Reset image mode
    isImageMode = false;
    createImageBtn.classList.remove('active');
    imageNotice.style.display = 'none';
    searchBox.classList.remove('image-mode');
    searchInput.placeholder = 'What do you want to know?';
});

// Send button click
sendBtn.addEventListener('click', sendMessage);

// Enter key to send
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Search input focus animation
searchInput.addEventListener('focus', () => {
    document.querySelector('.search-box').style.transform = 'scale(1.01)';
});

searchInput.addEventListener('blur', () => {
    document.querySelector('.search-box').style.transform = 'scale(1)';
});

// Action buttons click effect
const actionBtns = document.querySelectorAll('.action-btn');

actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    });
});

// Load chat from URL on page load
window.addEventListener('DOMContentLoaded', () => {
    loadChatFromUrl();
});

// Upgrade card animation on load
window.addEventListener('load', () => {
    const upgradeCard = document.querySelector('.upgrade-card');
    if (upgradeCard) {
        upgradeCard.style.opacity = '0';
        upgradeCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            upgradeCard.style.transition = 'all 0.5s ease';
            upgradeCard.style.opacity = '1';
            upgradeCard.style.transform = 'translateY(0)';
        }, 500);
    }
});

// این کد حذف می‌شود چون قبلاً در بالا تعریف شده است
