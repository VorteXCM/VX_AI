// Beauty Effects JavaScript for VX AI Interface

// Create particles when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create particles container if it doesn't exist
    if (!document.querySelector('.particles-container')) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);
        
        // Create particles
        createParticles();
    }
});

// Function to create floating particles
function createParticles() {
    const container = document.querySelector('.particles-container');
    const particleCount = 20; // Number of particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 5 and 20 pixels
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Random animation duration between 15 and 30 seconds
        const duration = Math.random() * 15 + 15;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 10;
        particle.style.animationDelay = `${delay}s`;
        
        // Add particle to container
        container.appendChild(particle);
    }
}

// Add typing indicator to messages
function addTypingIndicator(messageContainer) {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingIndicator.appendChild(dot);
    }
    
    messageContainer.appendChild(typingIndicator);
    return typingIndicator;
}

// Remove typing indicator
function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}

// Add pulse effect to buttons
function addPulseEffect() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('pulse-effect');
            setTimeout(() => {
                this.classList.remove('pulse-effect');
            }, 1000);
        });
    });
}

// Initialize effects
document.addEventListener('DOMContentLoaded', function() {
    addPulseEffect();
});