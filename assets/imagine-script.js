// Load all images from chats
function loadGalleryImages() {
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('emptyState');
    
    // Get all images from chats
    const allImages = [];
    
    // Load from regular chats
    const chats = JSON.parse(localStorage.getItem('vx_chats') || '[]');
    chats.forEach(chat => {
        chat.messages.forEach(msg => {
            if (msg.isImage && msg.content) {
                allImages.push({
                    url: msg.content,
                    prompt: msg.imagePrompt || 'No prompt',
                    timestamp: msg.timestamp,
                    chatId: chat.id
                });
            }
        });
    });
    
    // Load from private chats
    const privateChats = JSON.parse(localStorage.getItem('vx_private_chats') || '[]');
    privateChats.forEach(chat => {
        chat.messages.forEach(msg => {
            if (msg.isImage && msg.content) {
                allImages.push({
                    url: msg.content,
                    prompt: msg.imagePrompt || 'No prompt',
                    timestamp: msg.timestamp,
                    chatId: chat.id
                });
            }
        });
    });
    
    // Sort by timestamp (newest first)
    allImages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Display images
    if (allImages.length === 0) {
        emptyState.classList.add('show');
        return;
    }
    
    galleryGrid.innerHTML = '';
    allImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${image.url}" alt="${image.prompt}" loading="lazy">
            <div class="gallery-item-overlay">
                <p class="gallery-item-prompt">${image.prompt}</p>
            </div>
        `;
        item.addEventListener('click', () => openModal(image));
        galleryGrid.appendChild(item);
    });
}

// Modal functionality
const modalOverlay = document.getElementById('modalOverlay');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalPrompt = document.getElementById('modalPrompt');
const modalDate = document.getElementById('modalDate');
const modalDownload = document.getElementById('modalDownload');
const modalOpen = document.getElementById('modalOpen');
const modalDelete = document.getElementById('modalDelete');

let currentImage = null;

function openModal(image) {
    currentImage = image;
    
    modalImage.src = image.url;
    modalPrompt.textContent = image.prompt;
    modalDate.textContent = new Date(image.timestamp).toLocaleString();
    modalDownload.href = image.url;
    
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
    currentImage = null;
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

modalOpen.addEventListener('click', () => {
    if (currentImage) window.open(currentImage.url, '_blank');
});

modalDelete.addEventListener('click', () => {
    if (!currentImage) return;
    if (!confirm('Delete this image? This cannot be undone.')) return;
    
    // Remove from localStorage
    const chats = JSON.parse(localStorage.getItem('vx_chats') || '[]');
    const privateChats = JSON.parse(localStorage.getItem('vx_private_chats') || '[]');
    
    let deleted = false;
    
    // Search in regular chats
    chats.forEach(chat => {
        chat.messages = chat.messages.filter(msg => {
            if (msg.isImage && msg.content === currentImage.url) {
                deleted = true;
                return false;
            }
            return true;
        });
    });
    
    // Search in private chats
    privateChats.forEach(chat => {
        chat.messages = chat.messages.filter(msg => {
            if (msg.isImage && msg.content === currentImage.url) {
                deleted = true;
                return false;
            }
            return true;
        });
    });
    
    if (deleted) {
        localStorage.setItem('vx_chats', JSON.stringify(chats));
        localStorage.setItem('vx_private_chats', JSON.stringify(privateChats));
        closeModal();
        loadGalleryImages();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Load images on page load
loadGalleryImages();
