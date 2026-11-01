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
function animate() { ctx.clearRect(0,0,canvas.width, canvas.height); particlesArray.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
animate();

// 2. GAME STATE
let user = { gems: 50, iron: 1500, titanium: 500, dm: 10, pc: 5 };
let buildingsData = {
  'Command Center': { level: 1, spec: 'Base Core', desc: 'The heart of your station. Upgrading unlocks new tech.', cost: 1000 },
  'Resource Storage': { level: 1, spec: 'Economy', desc: 'Increases maximum capacity of Iron and Titanium.', cost: 500 },
  'Shield Generator': { level: 1, spec: 'Defense', desc: 'Protects your base from enemy raids.', cost: 800 },
  'Defense Turret': { level: 1, spec: 'Combat', desc: 'Automatically fires upon enemy invaders.', cost: 1200 }
};
let currentBuildingName = '';

function updateHUD() {
  document.getElementById('ui-gems').innerText = Math.floor(user.gems);
  document.getElementById('ui-iron').innerText = Math.floor(user.iron);
  document.getElementById('ui-tita').innerText = Math.floor(user.titanium);
  document.getElementById('ui-dm').innerText = Math.floor(user.dm);
  document.getElementById('ui-pc').innerText = Math.floor(user.pc);
}

setInterval(() => { user.iron += 5; user.gems += 0.5; updateHUD(); }, 1000);

window.onload = () => {
  updateHUD();
  setTimeout(() => { document.getElementById('loading').classList.add('hide'); }, 2000);
};

// 3. NAVIGATION LOGIC
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    const target = e.currentTarget.getAttribute('data-target');
    if(target !== 'outpost') {
      alert(target.toUpperCase() + " module is under construction!");
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-target="outpost"]').classList.add('active');
    }
    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  });
});

// 4. MATERIAL MODAL
window.openMaterialModal = function(name, img, desc) {
  document.getElementById('mat-modal-title').innerText = name;
  document.getElementById('mat-modal-img').src = img;
  document.getElementById('mat-modal-desc').innerText = desc;
  document.getElementById('material-modal').style.display = 'flex';
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
}

// 5. BUILDING SELECTION & MODAL (Adds Selection Ring)
window.selectBuilding = function(element, name, img) {
  // Remove 'selected' class from all buildings
  document.querySelectorAll('.building-node').forEach(node => node.classList.remove('selected'));
  // Add 'selected' class to clicked building
  element.classList.add('selected');
  
  // Haptic
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');

  // Open Modal after a tiny delay so user sees the ring
  setTimeout(() => {
    currentBuildingName = name;
    const data = buildingsData[name];
    
    document.getElementById('build-modal-title').innerText = name;
    document.getElementById('build-modal-img').src = `assets/${img}`;
    document.getElementById('build-level').innerText = data.level;
    document.getElementById('build-spec').innerText = data.spec;
    document.getElementById('build-desc').innerText = data.desc;
    document.getElementById('btn-upgrade').innerText = `UPGRADE (Cost: ${data.cost} Iron)`;
    
    document.getElementById('building-modal').style.display = 'flex';
  }, 150);
}

// 6. UPGRADE LOGIC
window.upgradeBuilding = function() {
  const data = buildingsData[currentBuildingName];
  
  if (user.iron >= data.cost) {
    user.iron -= data.cost;
    data.level += 1;
    data.cost = Math.floor(data.cost * 1.5); 
    
    updateHUD();
    
    // Refresh Modal Data
    document.getElementById('build-level').innerText = data.level;
    document.getElementById('btn-upgrade').innerText = `UPGRADE (Cost: ${data.cost} Iron)`;
    
    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    
    // Visual effect on building
    const node = document.querySelector('.building-node.selected img');
    node.style.filter = 'brightness(3) drop-shadow(0 0 30px #00f3ff)';
    setTimeout(() => node.style.filter = 'drop-shadow(0 15px 20px rgba(0,0,0,0.9))', 500);

  } else {
    alert("Not enough Iron! Your drones are still mining...");
  }
}

window.closeModals = function() {
  document.getElementById('material-modal').style.display = 'none';
  document.getElementById('building-modal').style.display = 'none';
  // Keep the selection ring for a moment, then remove
  setTimeout(() => {
    document.querySelectorAll('.building-node').forEach(node => node.classList.remove('selected'));
  }, 300);
}
