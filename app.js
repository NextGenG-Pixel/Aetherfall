if (window.Telegram) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

// 1. BACKGROUND PARTICLES
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
canvas.width = window.innerWidth; canvas.height = window.innerHeight;

class Particle {
  constructor() { this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height; this.size = Math.random()*2+0.5; this.speedY = Math.random()*0.5+0.1; this.opacity = Math.random()*0.5+0.2; }
  update() { this.y -= this.speedY; if(this.y < 0) { this.y = canvas.height; this.x = Math.random()*canvas.width; } }
  draw() { ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill(); }
}
for(let i=0; i<40; i++) particlesArray.push(new Particle());

function animate() { 
  ctx.clearRect(0,0,canvas.width, canvas.height); 
  particlesArray.forEach(p => { p.update(); p.draw(); }); 
  requestAnimationFrame(animate); 
}
animate();

// 2. GAME STATE (Idle Mining)
let user = {
  gems: 50, iron: 1500, titanium: 500, dm: 10, pc: 5
};

function updateHUD() {
  document.getElementById('ui-gems').innerText = Math.floor(user.gems);
  document.getElementById('ui-iron').innerText = Math.floor(user.iron);
  document.getElementById('ui-tita').innerText = Math.floor(user.titanium);
  document.getElementById('ui-dm').innerText = Math.floor(user.dm);
  document.getElementById('ui-pc').innerText = Math.floor(user.pc);
}

// Passive Idle Mining (Scavenger Drones simulating +Resources per second)
setInterval(() => {
  // Drones automatically mine Iron and Gems slowly
  user.iron += 5; 
  user.gems += 0.5;
  updateHUD();
}, 1000); // Every 1 second

// 3. LOADING SCREEN
window.onload = () => {
  updateHUD();
  setTimeout(() => { 
    document.getElementById('loading').classList.add('hide'); 
  }, 2000);
};

// 4. NAVIGATION LOGIC
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    const target = e.currentTarget.getAttribute('data-target');
    // For now, only Outpost is built. Alert for others.
    if(target !== 'outpost') {
      alert(target.toUpperCase() + " is coming in the next phase!");
      // Revert back to outpost visually
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-target="outpost"]').classList.add('active');
    }
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  });
});

// 5. BUILDING MODAL LOGIC
let currentBuilding = '';

window.openBuildingModal = function(name, imgSrc) {
  currentBuilding = name;
  document.getElementById('modal-title').innerText = name;
  document.getElementById('modal-img').src = `assets/${imgSrc}`;
  document.getElementById('building-modal').style.display = 'flex';
  
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  }
}

window.closeModal = function() {
  document.getElementById('building-modal').style.display = 'none';
}

window.upgradeBuilding = function() {
  if (user.iron >= 1000) {
    user.iron -= 1000;
    updateHUD();
    alert(currentBuilding + " Upgraded Successfully!");
    closeModal();
  } else {
    alert("Not enough Iron! Wait for your drones to mine more.");
  }
}
