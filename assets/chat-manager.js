// Chat Manager - مدیریت چت‌ها و تاریخچه

class ChatManager {
    constructor() {
        this.chats = this.loadChats();
        this.privateChats = this.loadPrivateChats();
        this.currentChatId = null;
        this.isPrivateMode = false;
    }

    // ایجاد چت جدید
    createNewChat(firstMessage, isPrivate = false) {
        const chatId = 'chat_' + Date.now();
        const chat = {
            id: chatId,
            title: this.generateTitle(firstMessage),
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPrivate: isPrivate
        };
        
        if (isPrivate) {
            this.privateChats.unshift(chat);
            this.savePrivateChats();
        } else {
            this.chats.unshift(chat);
            this.saveChats();
        }
        
        this.currentChatId = chatId;
        this.isPrivateMode = isPrivate;
        
        return chat;
    }

    // تولید عنوان از پیام اول
    generateTitle(message) {
        // حداکثر 50 کاراکتر
        if (message.length <= 50) {
            return message;
        }
        return message.substring(0, 47) + '...';
    }

    // افزودن پیام به چت فعلی
    addMessage(role, content, isImage = false, imagePrompt = null) {
        const chat = this.getCurrentChat();
        if (!chat) return;

        const message = {
            id: 'msg_' + Date.now(),
            role: role,
            content: content,
            timestamp: new Date().toISOString(),
            isImage: isImage,
            imagePrompt: imagePrompt
        };

        chat.messages.push(message);
        chat.updatedAt = new Date().toISOString();
        
        if (chat.isPrivate) {
            this.savePrivateChats();
        } else {
            this.saveChats();
        }
    }

    // دریافت چت فعلی
    getCurrentChat() {
        let chat = this.chats.find(chat => chat.id === this.currentChatId);
        if (!chat) {
            chat = this.privateChats.find(chat => chat.id === this.currentChatId);
        }
        return chat;
    }

    // تغییر چت فعلی
    switchChat(chatId) {
        this.currentChatId = chatId;
        return this.getCurrentChat();
    }

    // حذف چت
    deleteChat(chatId) {
        const isPrivate = this.privateChats.some(chat => chat.id === chatId);
        
        if (isPrivate) {
            this.privateChats = this.privateChats.filter(chat => chat.id !== chatId);
            this.savePrivateChats();
        } else {
            this.chats = this.chats.filter(chat => chat.id !== chatId);
            this.saveChats();
        }
        
        if (this.currentChatId === chatId) {
            this.currentChatId = null;
        }
    }

    // دریافت همه چت‌ها
    getAllChats() {
        return this.chats;
    }

    // دریافت همه چت‌های خصوصی
    getAllPrivateChats() {
        return this.privateChats;
    }

    // ذخیره چت‌های عادی در localStorage
    saveChats() {
        localStorage.setItem('vx_chats', JSON.stringify(this.chats));
    }

    // بارگذاری چت‌های عادی از localStorage
    loadChats() {
        const saved = localStorage.getItem('vx_chats');
        return saved ? JSON.parse(saved) : [];
    }

    // ذخیره چت‌های خصوصی در localStorage
    savePrivateChats() {
        localStorage.setItem('vx_private_chats', JSON.stringify(this.privateChats));
    }

    // بارگذاری چت‌های خصوصی از localStorage
    loadPrivateChats() {
        const saved = localStorage.getItem('vx_private_chats');
        return saved ? JSON.parse(saved) : [];
    }

    // پاک کردن همه چت‌ها
    clearAllChats() {
        this.chats = [];
        this.currentChatId = null;
        this.saveChats();
    }

    // پاک کردن همه چت‌های خصوصی
    clearAllPrivateChats() {
        this.privateChats = [];
        this.savePrivateChats();
    }
}

// ایجاد نمونه global
const chatManager = new ChatManager();
