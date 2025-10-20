// Beauty Effects JavaScript for VX AI Interface

// Meteor Effect
document.addEventListener('DOMContentLoaded', function() {
    // Create container for meteors
    const meteorContainer = document.createElement('div');
    meteorContainer.className = 'meteor-container';
    meteorContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1; overflow: hidden;';
    document.body.appendChild(meteorContainer);

    // Define meteor paths (start and end positions)
    const meteorPaths = [
        { startX: -5, startY: 15, endX: 105, endY: 85 },
        { startX: -5, startY: 35, endX: 105, endY: 65 },
        { startX: 105, startY: 25, endX: -5, endY: 75 }
    ];

    // Function to create a meteor
    function createMeteor(pathIndex) {
        const path = meteorPaths[pathIndex % meteorPaths.length];
        
        // Create meteor element
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8),
                        0 0 20px 5px rgba(255, 255, 255, 0.5),
                        0 0 30px 10px rgba(255, 255, 255, 0.3);
            top: ${path.startY}%;
            left: ${path.startX}%;
            transform: translateX(-50%) translateY(-50%);
            opacity: 0;
            z-index: -1;
        `;
        
        // Create meteor tail
        const tail = document.createElement('div');
        tail.className = 'meteor-tail';
        tail.style.cssText = `
            position: absolute;
            top: 50%;
            right: 0;
            width: 50px;
            height: 1px;
            background: linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));
            transform-origin: right center;
            transform: translateY(-50%);
        `;
        
        meteor.appendChild(tail);
        meteorContainer.appendChild(meteor);
        
        // Animate meteor
        const angle = Math.atan2(path.endY - path.startY, path.endX - path.startX);
        meteor.style.transform = `translateX(-50%) translateY(-50%) rotate(${angle}rad)`;
        
        // Apply animation
        meteor.animate([
            { 
                transform: `translate(${path.startX}%, ${path.startY}%) rotate(${angle}rad)`,
                opacity: 0
            },
            { 
                transform: `translate(${path.startX + 5}%, ${path.startY + 5 * (path.endY - path.startY) / (path.endX - path.startX)}%) rotate(${angle}rad)`,
                opacity: 1
            },
            { 
                transform: `translate(${path.endX - 5}%, ${path.endY - 5 * (path.endY - path.startY) / (path.endX - path.startX)}%) rotate(${angle}rad)`,
                opacity: 1
            },
            { 
                transform: `translate(${path.endX}%, ${path.endY}%) rotate(${angle}rad)`,
                opacity: 0
            }
        ], {
            duration: 3000,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
        
        // Remove meteor after animation
        setTimeout(() => {
            meteorContainer.removeChild(meteor);
        }, 3000);
    }
    
    // Create meteors at intervals
    let pathIndex = 0;
    setInterval(() => {
        createMeteor(pathIndex);
        pathIndex = (pathIndex + 1) % meteorPaths.length;
    }, 10000); // Every 10 seconds
    
    // Create initial meteor
    createMeteor(pathIndex);
});

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