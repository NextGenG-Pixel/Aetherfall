console.log("Aetherfall Engine Starting...");

const tg = window.Telegram.WebApp;
let playerName = "COMMANDER";
if (tg) { 
  tg.ready(); 
  tg.expand(); 
  if (tg.initDataUnsafe?.user) playerName = tg.initDataUnsafe.user.first_name || "COMMANDER"; 
}

const GAME_DATABASE = {
  character: [
    { id: 'char_default', name: 'Cadet', basePower: 100 },
    { id: 'char_epic', name: 'Cyber Ninja', basePower: 500 },
    { id: 'char_legendary', name: 'Warlord', basePower: 1500 },
    { id: 'char_mythic', name: 'Cosmic God', basePower: 5000 }
  ],
  weapon: [{ id: 'wep_rifle', basePower: 100 }, { id: 'wep_sword', basePower: 150 }, { id: 'wep_cannon', basePower: 300 }],
  pet: [{ id: 'pet_dog', basePower: 50 }, { id: 'pet_dragon', basePower: 500 }],
  vehicle: [{ id: 'veh_bike', basePower: 200 }],
  armor: [{ id: 'arm_vest', basePower: 50 }, { id: 'arm_helmet', basePower: 50 }]
};

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

function calculatePower(baseItemId, rarity = 'normal', level = 1) {
  let basePower = 100;
  for (const category in GAME_DATABASE) {
    const found = GAME_DATABASE[category].find(i => i.id === baseItemId);
    if (found) { basePower = found.basePower; break; }
  }
  const rarityMultipliers = { normal: 1, epic: 1.5, legendary: 2.5, mythic: 5 };
  return Math.floor(basePower * (rarityMultipliers[rarity] || 1) * level);
}

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
          <div class="hud-slot slot-weapon"><img src="assets/${userState.equipped.weapon}.jpg" onerror="this.style.display='none'"></div>
          <div class="hud-slot slot-pet"><img src="assets/${userState.equipped.pet}.jpg" onerror="this.style.display='none'"></div>
          <div class="hud-slot slot-vehicle"><img src="assets/${userState.equipped.vehicle}.jpg" onerror="this.style.display='none'"></div>
          <div class="hud-slot slot-armor"><img src="assets/${userState.equipped.armor}.jpg" onerror="this.style.display='none'"></div>
        </div>
        <button class="collect-btn">COLLECT IDLE RESOURCES</button>
      </div>
    `;
  } else if (viewName === 'armory') {
    document.body.classList.remove('outpost-view');
    main.innerHTML = `
      <div class="fade-in">
        <h1 class="view-title neon-glow-cyan" style="font-size: 20px; margin-bottom: 15px;">ARMORY</h1>
        <div class="armory-tabs">
          <button class="tab-btn active">Weapons</button>
          <button class="tab-btn">Armor</button>
        </div>
        <div class="inventory-grid">
          <div class="item-card card-normal">
            <img src="assets/wep_rifle_normal.jpg" onerror="this.src='https://via.placeholder.com/80/000000/fff?text=Item'">
            <p class="item-name">Plasma Rifle</p>
            <p class="item-power">${calculatePower('wep_rifle', 'normal', 1)} PWR</p>
            <button class="equip-btn" onclick="equipItem('wep_rifle_normal')">EQUIP</button>
          </div>
          <div class="item-card card-epic">
            <img src="assets/wep_rifle_epic.jpg" onerror="this.src='https://via.placeholder.com/80/000000/00f3ff?text=Item'">
            <p class="item-name">Plasma Rifle</p>
            <p class="item-power">${calculatePower('wep_rifle', 'epic', 5)} PWR</p>
            <button class="equip-btn" onclick="equipItem('wep_rifle_epic')">EQUIP</button>
          </div>
        </div>
      </div>
    `;
  } else {
    document.body.classList.remove('outpost-view');
    main.innerHTML = `<div class="fade-in" style="text-align: center; margin-top: 50px;"><h1 class="view-title neon-glow-cyan">${viewName.toUpperCase()}</h1><p>Coming Soon...</p></div>`;
  }
}

window.equipItem = function(itemId) {
  if (itemId.includes('wep_')) userState.equipped.weapon = itemId;
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  renderView('outpost');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-view="outpost"]').classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    renderView(e.currentTarget.getAttribute('data-view'));
  });
});

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
