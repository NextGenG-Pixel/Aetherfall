// ================================================
// AETHERFALL: NEXUS PROTOCOL - CORE ENGINE (v13)
// ================================================

const tg = window.Telegram.WebApp;
let playerName = "COMMANDER";
if (tg) { 
  tg.ready(); 
  tg.expand(); 
  if (tg.initDataUnsafe?.user) playerName = tg.initDataUnsafe.user.first_name || "COMMANDER"; 
}

// 🧠 ১. গেমের মডুলার ডাটাবেস
const GAME_DATABASE = {
  character: [
    { id: 'char_default', name: 'Cadet', basePower: 100, image: 'char_default.jpg' },
    { id: 'char_epic', name: 'Cyber Ninja', basePower: 500, image: 'char_epic.jpg' },
    { id: 'char_legendary', name: 'Warlord', basePower: 1500, image: 'char_legendary.jpg' },
    { id: 'char_mythic', name: 'Cosmic God', basePower: 5000, image: 'char_mythic.jpg' }
  ],
  weapon: [
    { id: 'wep_rifle', name: 'Plasma Rifle', basePower: 100 },
    { id: 'wep_sword', name: 'Cyber Sword', basePower: 150 },
    { id: 'wep_cannon', name: 'Heavy Cannon', basePower: 300 }
  ],
  pet: [
    { id: 'pet_dog', name: 'Cyber Dog', basePower: 50 },
    { id: 'pet_dragon', name: 'Mecha Dragon', basePower: 500 }
  ],
  vehicle: [
    { id: 'veh_bike', name: 'Hoverbike', basePower: 200 }
  ],
  armor: [
    { id: 'arm_vest', name: 'Vest', basePower: 50 },
    { id: 'arm_helmet', name: 'Helmet', basePower: 50 }
  ]
};

// 🎮 ২. ইউজারের বর্তমান অবস্থা (State)
let userState = {
  name: playerName,
  gems: 50,
  credits: 1000,
  equipped: {
    character: 'char_default',
    weapon: 'wep_rifle_normal',
    pet: 'pet_dog_normal',
    vehicle: 'veh_bike_normal',
    armor: 'arm_vest_normal'
  }
};

// 🧮 ৩. পাওয়ার ক্যালকুলেশন লজিক
function calculatePower(baseItemId, rarity = 'normal', level = 1) {
  let basePower = 100;
  for (const category in GAME_DATABASE) {
    const found = GAME_DATABASE[category].find(i => i.id === baseItemId);
    if (found) { basePower = found.basePower; break; }
  }
  const rarityMultipliers = { normal: 1, epic: 1.5, legendary: 2.5, mythic: 5 };
  const multiplier = rarityMultipliers[rarity] || 1;
  return Math.floor(basePower * multiplier * level);
}

// 🖼️ ৪. ভিউ রেন্ডারিং ফাংশন
function renderView(viewName) {
  const main = document.getElementById('app-main');
  
  if (viewName === 'outpost') {
    document.body.classList.add('outpost-view'); 
    
    let totalPower = calculatePower(userState.equipped.character, 'normal', 1);
    
    main.innerHTML = `
      <div class="outpost-container fade-in">
        <h1 class="total-power-display">POWER: ${totalPower.toLocaleString()}</h1>
        
        <div class="character-area">
          <div class="tech-ring"></div>
          <div class="character-pedestal"></div>
          
          <img src="assets/${userState.equipped.character}.jpg" class="main-character" onerror="this.src='https://via.placeholder.com/250/000000/00f3ff?text=CHARACTER'">
          
          <div class="hud-slot slot-weapon"><img src="assets/${userState.equipped.weapon || 'wep_rifle_normal'}.jpg" onerror="this.style.display='none'"></div>
          <div class="hud-slot slot-pet"><img src="assets/${userState.equipped.pet || 'pet_dog_normal'}.jpg" onerror="this.style.display='none'"></div>
          <div class="hud-slot slot-vehicle"><img src="assets/${userState.equipped.vehicle || 'veh_bike_normal'}.jpg" onerror="this.style.display='none'"></div>
          <div class="hud-slot slot-armor"><img src="assets/${userState.equipped.armor || 'arm_vest_normal'}.jpg" onerror="this.style.display='none'"></div>
        </div>

        <button class="collect-btn">COLLECT IDLE RESOURCES</button>
      </div>
    `;
  } 
  
  else if (viewName === 'armory') {
    document.body.classList.remove('outpost-view');
    
    main.innerHTML = `
      <div class="fade-in">
        <h1 class="view-title neon-glow-cyan" style="font-size: 20px; margin-bottom: 15px;">ARMORY</h1>
        
        <div class="armory-tabs">
          <button class="tab-btn active">Weapons</button>
          <button class="tab-btn">Armor</button>
          <button class="tab-btn">Pets</button>
          <button class="tab-btn">Vehicles</button>
        </div>

        <div class="inventory-grid">
          <div class="item-card card-normal">
            <span class="item-level">Lvl 1</span>
            <img src="assets/wep_rifle_normal.jpg" onerror="this.src='https://via.placeholder.com/80/000000/fff?text=Item'">
            <p class="item-name">Plasma Rifle</p>
            <p class="item-power">${calculatePower('wep_rifle', 'normal', 1)} PWR</p>
            <button class="equip-btn" onclick="equipItem('wep_rifle_normal')">EQUIP</button>
          </div>

          <div class="item-card card-epic">
            <span class="item-level">Lvl 5</span>
            <img src="assets/wep_rifle_epic.jpg" onerror="this.src='https://via.placeholder.com/80/000000/00f3ff?text=Item'">
            <p class="item-name">Plasma Rifle</p>
            <p class="item-power">${calculatePower('wep_rifle', 'epic', 5)} PWR</p>
            <button class="equip-btn" onclick="equipItem('wep_rifle_epic')">EQUIP</button>
          </div>
        </div>
      </div>
    `;
  } 
  
  else {
    document.body.classList.remove('outpost-view');
    main.innerHTML = `
      <div class="fade-in" style="text-align: center; margin-top: 50px;">
        <h1 class="view-title neon-glow-cyan">${viewName.toUpperCase()}</h1>
        <p class="view-subtitle">Coming Soon...</p>
      </div>
    `;
  }
}

// 🛠️ ৫. ইকুইপ ফাংশন
window.equipItem = function(itemId) {
  if (itemId.includes('wep_')) userState.equipped.weapon = itemId;
  if (itemId.includes('pet_')) userState.equipped.pet = itemId;
  if (itemId.includes('arm_')) userState.equipped.armor = itemId;
  if (itemId.includes('veh_')) userState.equipped.vehicle = itemId;
  
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  
  renderView('outpost');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-view="outpost"]').classList.add('active');
}

// ৬. নেভিগেশন ক্লিক ইভেন্ট
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    renderView(e.currentTarget.getAttribute('data-view'));
    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
  });
});

// ৭. গেম স্টার্ট
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles-canvas');
  if(canvas) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight;
    let particles = Array(40).fill().map(() => ({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*2, s: Math.random()*0.5 }));
    function draw() { ctx.clearRect(0,0,w,h); ctx.fillStyle = '#00f3ff'; particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill(); p.y -= p.s; if(p.y<0) p.y=h; }); requestAnimationFrame(draw); }
    draw();
  }

  setTimeout(() => {
    document.getElementById('loading-overlay').classList.add('hidden');
    document.getElementById('user-name').innerText = userState.name.toUpperCase();
    renderView('outpost');
  }, 1500);
});
