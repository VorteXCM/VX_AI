// History Page JavaScript

const historyContainer = document.getElementById('historyContainer');
const historySearchInput = document.getElementById('historySearchInput');
const filterTabs = document.querySelectorAll('.filter-tab');
const collapseBtn = document.getElementById('collapseBtn');
const sidebar = document.getElementById('sidebar');

let currentFilter = 'all';
let searchQuery = '';

// Sidebar toggle
let sidebarExpanded = false;

collapseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebarExpanded = !sidebarExpanded;
    sidebar.classList.toggle('expanded');
});

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

// Format time ago
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'همین الان';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقیقه پیش`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ساعت پیش`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} روز پیش`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} هفته پیش`;
    return `${Math.floor(seconds / 2592000)} ماه پیش`;
}

// Get chat preview (first user message)
function getChatPreview(chat) {
    const firstUserMsg = chat.messages.find(msg => msg.role === 'user');
    if (firstUserMsg) {
        return firstUserMsg.content.length > 100 
            ? firstUserMsg.content.substring(0, 100) + '...'
            : firstUserMsg.content;
    }
    return 'No messages';
}

// Filter chats by date
function filterChatsByDate(chats, filter) {
    if (filter === 'all') return chats;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return chats.filter(chat => {
        const chatDate = new Date(chat.createdAt);
        
        switch(filter) {
            case 'today':
                return chatDate >= today;
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return chatDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return chatDate >= monthAgo;
            default:
                return true;
        }
    });
}

// Search chats
function searchChats(chats, query) {
    if (!query) return chats;
    
    const lowerQuery = query.toLowerCase();
    return chats.filter(chat => {
        return chat.title.toLowerCase().includes(lowerQuery) ||
               chat.messages.some(msg => msg.content.toLowerCase().includes(lowerQuery));
    });
}

// Group chats by date
function groupChatsByDate(chats) {
    const groups = {
        today: [],
        yesterday: [],
        thisWeek: [],
        thisMonth: [],
        older: []
    };
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    chats.forEach(chat => {
        const chatDate = new Date(chat.createdAt);
        
        if (chatDate >= today) {
            groups.today.push(chat);
        } else if (chatDate >= yesterday) {
            groups.yesterday.push(chat);
        } else if (chatDate >= weekAgo) {
            groups.thisWeek.push(chat);
        } else if (chatDate >= monthAgo) {
            groups.thisMonth.push(chat);
        } else {
            groups.older.push(chat);
        }
    });
    
    return groups;
}

// Render history
function renderHistory() {
    let chats = chatManager.getAllChats();
    
    // Apply filters
    chats = filterChatsByDate(chats, currentFilter);
    chats = searchChats(chats, searchQuery);
    
    if (chats.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3>تاریخچه‌ای یافت نشد</h3>
                <p>هنوز چتی ایجاد نکرده‌اید یا نتیجه‌ای برای جستجوی شما یافت نشد</p>
            </div>
        `;
        return;
    }
    
    const groups = groupChatsByDate(chats);
    let html = '';
    
    const groupTitles = {
        today: 'امروز',
        yesterday: 'دیروز',
        thisWeek: 'این هفته',
        thisMonth: 'این ماه',
        older: 'قدیمی‌تر'
    };
    
    Object.keys(groups).forEach(groupKey => {
        if (groups[groupKey].length > 0) {
            html += `
                <div class="history-section">
                    <div class="history-section-title">${groupTitles[groupKey]}</div>
                    <div class="history-list">
            `;
            
            groups[groupKey].forEach(chat => {
                html += `
                    <a href="index.html?chat=${chat.id}" class="history-item" data-chat-id="${chat.id}">
                        <div class="history-item-content">
                            <div class="history-item-title">${chat.title}</div>
                            <div class="history-item-preview">${getChatPreview(chat)}</div>
                        </div>
                        <div class="history-item-meta">
                            <div class="history-item-time">${timeAgo(chat.updatedAt)}</div>
                            <div class="history-item-actions">
                                <button class="history-action-btn delete" onclick="deleteChat(event, '${chat.id}')" title="Delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </a>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    historyContainer.innerHTML = html;
}

// Delete chat
function deleteChat(event, chatId) {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('آیا مطمئن هستید که می‌خواهید این چت را حذف کنید؟')) {
        chatManager.deleteChat(chatId);
        renderHistory();
    }
}

// Filter tabs
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderHistory();
    });
});

// Search
historySearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderHistory();
});

// Initial render
renderHistory();
