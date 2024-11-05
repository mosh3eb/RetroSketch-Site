const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const tools = document.querySelectorAll('.tool-btn');
const colorPicker = document.getElementById('color-picker');
const sizeSlider = document.getElementById('size-slider');
const soundToggle = document.getElementById('sound-toggle');

let isDrawing = false;
let currentTool = 'pencil';
let soundEnabled = true;

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing settings
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Sound effects
const drawingSound = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==');

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    draw(e);
    if (soundEnabled) {
        drawingSound.currentTime = 0;
        drawingSound.play();
    }
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
    if (soundEnabled) {
        drawingSound.pause();
    }
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = sizeSlider.value;
    ctx.strokeStyle = currentTool === 'eraser' ? '#fff' : colorPicker.value;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (currentTool === 'brush') {
        ctx.shadowBlur = 5;
        ctx.shadowColor = ctx.strokeStyle;
    } else {
        ctx.shadowBlur = 0;
    }
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

tools.forEach(tool => {
    tool.addEventListener('click', () => {
        const toolId = tool.id;
        if (toolId !== 'clear' && toolId !== 'save' && toolId !== 'sound-toggle') {
            tools.forEach(t => t.classList.remove('active'));
            tool.classList.add('active');
            currentTool = toolId;
        }
    });
});

// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Save drawing
document.getElementById('save').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'retrosketch.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Sound toggle
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.innerHTML = soundEnabled ?
        '<i class="fas fa-volume-up"></i>' :
        '<i class="fas fa-volume-mute"></i>';
});

// Add retro effects
function addRetroEffect() {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(212, 188, 139, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
}

setInterval(addRetroEffect, 1000);

// Add vintage paper texture
const texture = new Image();
texture.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAG1BMVEWqqqoxMTEAAAAZGRlUVFSMjIx/f39wcHBmZmYlhOVpAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAQklEQVQ4jWNgQAX8DAz8DAz7GBj2MTDsY2DYx8CwT4FhHwPDPgWGfQwM+xQY9jEw7FNg2MfAsE+BYR8Dwz4Fhn0MAD4TCxMQRQUiAAAAAElFTkSuQmCC';
texture.onload = () => {
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = ctx.createPattern(texture, 'repeat');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
};