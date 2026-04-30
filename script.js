const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const namesInput = document.getElementById('names-input');

let names = [];
let colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
let currentRotation = 0;
let isSpinning = false;

function updateWheel() {
    names = namesInput.value.split('\n').filter(n => n.trim() !== '');
    drawWheel();
}

function drawWheel() {
    const total = names.length;
    if (total === 0) return;

    const arc = (Math.PI * 2) / total;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((name, i) => {
        const angle = currentRotation + i * arc;
        
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 190, angle, angle + arc);
        ctx.lineTo(200, 200);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Outfit";
        ctx.fillText(name, 180, 5);
        ctx.restore();
    });
}

function spin() {
    if (isSpinning || names.length === 0) return;
    isSpinning = true;

    const duration = 4000;
    const start = Date.now();
    const extraRotations = Math.random() * 5 + 5; // 5 to 10 full turns
    const totalRotation = extraRotations * Math.PI * 2;

    const initialRotation = currentRotation;

    function animate() {
        const now = Date.now();
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (out-cubic)
        const ease = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = initialRotation + totalRotation * ease;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            announceWinner();
        }
    }
    requestAnimationFrame(animate);
}

function announceWinner() {
    const total = names.length;
    const arc = (Math.PI * 2) / total;
    
    // Normalize rotation to [0, 2PI]
    const normalized = (currentRotation % (Math.PI * 2));
    // The pointer is at the top (-PI/2), but canvas angles start from the right (0)
    // We need to find which slice is at -PI/2
    // Angle of pointer relative to current rotation: (-PI/2 - currentRotation)
    let pointerAngle = -Math.PI / 2 - currentRotation;
    while (pointerAngle < 0) pointerAngle += Math.PI * 2;
    
    const index = Math.floor(pointerAngle / arc) % total;
    const winner = names[index];

    document.getElementById('winner-name').textContent = winner;
    document.getElementById('win-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('win-modal').classList.add('hidden');
}

updateWheel();
