// Confetti Animation
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confetti = [];
const confettiCount = 100;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
    { front: '#ff6b9d', back: '#c44569' },
    { front: '#4facfe', back: '#00f2fe' },
    { front: '#f8b500', back: '#ffd700' },
    { front: '#a8edea', back: '#fed6e3' },
    { front: '#ff8fab', back: '#ff6b9d' }
];

// Confetti class
class ConfettiPiece {
    constructor() {
        this.randomModifier = Math.random() * 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.dimensions = {
            x: Math.random() * 5 + 5,
            y: Math.random() * 5 + 5
        };
        this.position = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height
        };
        this.rotation = Math.random() * Math.PI * 2;
        this.velocity = {
            x: Math.random() * 50 - 25,
            y: Math.random() * 50 + 50
        };
    }

    update() {
        this.rotation += this.velocity.x * 0.1;
        this.velocity.x -= this.velocity.x * drag;
        this.velocity.y = Math.min(this.velocity.y + gravity, terminalVelocity);
        this.velocity.y -= this.velocity.y * drag;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y >= canvas.height) {
            this.position.y = -10;
            this.position.x = Math.random() * canvas.width;
        }
        if (this.position.x > canvas.width) {
            this.position.x = 0;
        }
        if (this.position.x < 0) {
            this.position.x = canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.dimensions.x, this.dimensions.y);
        ctx.lineTo(this.dimensions.x + this.dimensions.x * 0.5, this.dimensions.y - this.dimensions.y * 0.5);
        ctx.lineTo(this.dimensions.x, this.dimensions.y - this.dimensions.y);
        ctx.lineTo(0, this.dimensions.y - this.dimensions.y);
        ctx.lineTo(-this.dimensions.x * 0.5, this.dimensions.y - this.dimensions.y * 0.5);
        ctx.closePath();
        ctx.fillStyle = this.color.front;
        ctx.fill();
        ctx.restore();
    }
}

// Initialize confetti
for (let i = 0; i < confettiCount; i++) {
    confetti.push(new ConfettiPiece());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((piece) => {
        piece.update();
        piece.draw();
    });
    requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Card flip functionality
let isFlipped = false;

function flipCard() {
    const card = document.querySelector('.card');
    const flipBtn = document.querySelector('.flip-btn');
    
    isFlipped = !isFlipped;
    card.classList.toggle('flipped', isFlipped);
    flipBtn.textContent = isFlipped ? 'Cerrar Tarjeta' : 'Abrir Tarjeta';
}

// Cake modal functionality
let candleBlown = false;

function showCake() {
    const modal = document.getElementById('cakeModal');
    modal.style.display = 'block';
    candleBlown = false;
    
    // Reset flame if it was blown
    const flame = document.querySelector('.flame');
    if (flame) {
        flame.style.animation = 'flicker 0.3s ease-in-out infinite alternate';
        flame.style.opacity = '1';
        flame.style.transform = 'translateX(-50%) scale(1)';
        flame.style.transition = '';
    }
    
    // Add click event to the entire cake
    const cake = document.querySelector('.cake');
    if (cake) {
        cake.onclick = blowCandle;
    }
}

function closeCake() {
    const modal = document.getElementById('cakeModal');
    modal.style.display = 'none';
}

function blowCandle() {
    if (candleBlown) return; // Prevent multiple clicks
    
    const flame = document.querySelector('.flame');
    if (!flame) return;
    
    candleBlown = true;
    
    // Animate flame going out with smooth transition
    flame.style.animation = 'none';
    flame.style.transition = 'all 0.5s ease-out';
    flame.style.opacity = '0';
    flame.style.transform = 'translateX(-50%) scale(0)';
    
    // Show celebration message
    setTimeout(() => {
        const cakeMessage = document.querySelector('.cake-message');
        if (cakeMessage) {
            cakeMessage.textContent = '¡Tu deseo se hará realidad! ✨🎉';
            cakeMessage.style.animation = 'pulse 1s ease-in-out infinite';
        }
    }, 500);
    
    // Reset after 4 seconds
    setTimeout(() => {
        candleBlown = false;
        if (flame) {
            flame.style.transition = '';
            flame.style.animation = 'flicker 0.3s ease-in-out infinite alternate';
            flame.style.opacity = '1';
            flame.style.transform = 'translateX(-50%) scale(1)';
        }
        const cakeMessage = document.querySelector('.cake-message');
        if (cakeMessage) {
            cakeMessage.textContent = '¡Toca el pastel para soplar la vela! 🎂✨';
            cakeMessage.style.animation = '';
        }
    }, 4000);
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('cakeModal');
    if (event.target === modal) {
        closeCake();
    }
});

// Add sparkle effect on card front
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkle 1s ease-out forwards';
    document.querySelector('.card-front').appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add sparkles on card click
document.querySelector('.card-front').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createSparkle(x, y);
});

// Add entrance animation
window.addEventListener('load', () => {
    const card = document.querySelector('.card');
    card.style.animation = 'slideDown 1s ease-out';
});

