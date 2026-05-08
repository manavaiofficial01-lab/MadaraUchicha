import './style.css'

const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');

const frameCount = 240;
const currentFrame = index => (
  `/frames/Timeline 1_00108${(index).toString().padStart(3, '0')}.jpg`
);

// Preload images
const images = [];
const imageObjects = {
  frame: 0
};

let loadedCount = 0;
const loader = document.getElementById('loading');

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    loadedCount++;
    if (loadedCount > 20) { // Show first few frames and hide loader
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
  };
  images.push(img);
}

const img = new Image();
img.src = currentFrame(0);
canvas.width = 1920;
canvas.height = 1080;
img.onload = function() {
  context.drawImage(img, 0, 0);
};

const updateImage = index => {
  const frameIndex = Math.min(frameCount - 1, Math.max(0, index));
  const activeImage = images[frameIndex];
  if (activeImage && activeImage.complete) {
    render(activeImage);
  }
};

const render = (img) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0);
};

let targetFrameIndex = 0;
let currentFrameIndex = 0;

const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

window.addEventListener('scroll', () => {  
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  
  // Apply easing to the scroll fraction for a more cinematic "ease in"
  const easedFraction = easeInOutCubic(scrollFraction);
  targetFrameIndex = Math.floor(easedFraction * (frameCount - 1));
});

const animate = () => {
  // Smoothly interpolate towards the target frame (lowered to 0.08 for more smoothness)
  currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.08;
  updateImage(Math.round(currentFrameIndex));
  requestAnimationFrame(animate);
};

animate();

const cursor = document.querySelector('.cursor');

window.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

window.addEventListener('mousedown', () => {
  cursor.style.width = '15px';
  cursor.style.height = '15px';
});

window.addEventListener('mouseup', () => {
  cursor.style.width = '20px';
  cursor.style.height = '20px';
});

const resizeCanvas = () => {
  canvas.width = 1920;
  canvas.height = 1080;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
