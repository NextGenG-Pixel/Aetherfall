if (window.Telegram) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

// Particles
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
class Particle {
  constructor() { this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height; this.size = Math.random()*2+0.5; this.speedY = Math.random()*1+0.2; this.opacity = Math.random()*0.8+0.2; }
  update() { this.y -= this.speedY; if(this.y < 0) { this.y = canvas.height; this.x = Math.random()*canvas.width; } }
  draw() { ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill(); }
}
for(let i=0; i<50; i++) particlesArray.push(new Particle());
function animate() { ctx.clearRect(0,0,canvas.width, canvas.height); particlesArray.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
animate();

// Game State
let user = {
  gems: 50, iron: 1000, titanium: 500, darkMatter: 10, plasma: 5,
  equipped: { char: 'char_default', weapon: 'wep_rifle_normal', pet: 'pet_dog_normal' },
  unlockedItems: ['char_default', 'wep_rifle_normal', 'pet_dog_normal']
};

const allGameItems = [
  { id: 'char_default', name: 'Cadet', type: 'char', rarity: 'normal', power: 100 },
  { id: 'char_epic', name: 'Cyber Ninja', type: 'char', rarity: 'epic', power: 500 },
  { id: 'char_enemy', name: 'Shadow', type: 'char', rarity: 'normal', power: 100 },
  { id: 'wep_rifle_normal', name: 'Std Rifle', type: 'weapon', rarity: 'normal', power: 50 },
  { id: 'wep_rifle_epic', name: 'Plasma Rifle', type: 'weapon', rarity: 'epic', power: 300 },
  { id: 'pet_dog_normal', name: 'Cyber Dog', type: 'pet', rarity: 'normal', power: 50 },
  { id: 'pet_dragon_legendary', name: 'Mecha Dragon', type: 'pet', rarity: 'legendary', power: 1000 }
];

window.onload = () => {
  setTimeout(() => { document.getElementById('loading').classList.add('hide'); updateUI(); }, 1500);
};

function updateUI() {
  document.getElementById('ui-gems').innerText = user.gems;
  document.getElementById('ui-iron').innerText = user.iron;
  document.getElementById('ui-tita').innerText = user.titanium;
  document.getElementById('ui-dm').innerText = user.darkMatter;
  document.getElementById('ui-pc').innerText = user.plasma;
  
  let total = 0;
  for (let type in user.equipped) {
    let item = allGameItems.find(i => i.id === user.equipped[type]);
    if(item) total += item.power;
  }
  document.getElementById('ui-total-power').innerText = `POWER: ${total}`;
  
  document.getElementById('ui-main-char').src = `assets/${user.equipped.char}.png`;
  document.getElementById('p-char-img').src = `assets/${user.equipped.char}.png`;
  document.getElementById('p-pet-img').src = `assets/${user.equipped.pet}.png`;
  document.getElementById('e-char-img').src = `assets/char_enemy.png`;
  document.getElementById('e-pet-img').src = `assets/pet_dragon_legendary.png`;

  renderArmory();
}

function nav(screenId, btnElement) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if(btnElement) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
}

function renderArmory() {
  const grid = document.getElementById('ui-inventory');
  grid.innerHTML = allGameItems.map(item => {
    if(item.id === 'char_enemy') return ''; 
    const isUnlocked = user.unlockedItems.includes(item.id);
    const isEquipped = user.equipped[item.type] === item.id;
    
    let cardClass = isUnlocked ? `card-${item.rarity}` : 'card-locked';
    let lockIcon = isUnlocked ? '' : '<i class="ph-fill ph-lock-key lock-icon"></i>';
    let equippedText = isEquipped ? '<div style="color:var(--green); font-size:10px; font-weight:bold; margin-top:3px;">EQUIPPED</div>' : '';
    
    return `
      <div class="item-card ${cardClass}" onclick="handleItemClick('${item.id}')">
        ${lockIcon}
        <img src="assets/${item.id}.png" onerror="this.src='https://via.placeholder.com/150/111/00f3ff?text=?'">
        <div class="info-overlay">
          <div class="name">${item.name}</div>
          <div class="power">${item.power} PWR</div>
          ${equippedText}
        </div>
      </div>
    `;
  }).join('');
}

function handleItemClick(id) {
  const item = allGameItems.find(i => i.id === id);
  const isUnlocked = user.unlockedItems.includes(id);
  
  if (!isUnlocked) {
    document.getElementById('upgrade-modal').style.display = 'flex';
    document.getElementById('modal-img').src = `assets/${id}.png`;
    document.getElementById('modal-title').innerText = `UNLOCK ${item.name.toUpperCase()}`;
    document.getElementById('modal-desc').innerHTML = `Cost: <span style="color:gold;">500 Iron + 2 Plasma</span>`;
    
    let btn = document.getElementById('btn-modal-action');
    btn.innerText = "UNLOCK NOW";
    btn.onclick = () => {
      if(user.iron >= 500 && user.plasma >= 2) {
        user.iron -= 500; user.plasma -= 2;
        user.unlockedItems.push(id);
        updateUI(); closeModal();
      } else { alert("Not enough materials!"); }
    };
  } else {
    user.equipped[item.type] = item.id;
    updateUI();
  }
}

function closeModal() { document.getElementById('upgrade-modal').style.display = 'none'; }

let isFighting = false, pHpVal = 100, eHpVal = 100;

function startBattle() {
  if(isFighting) return;
  isFighting = true; pHpVal = 100; eHpVal = 100;
  document.getElementById('p-hp').style.width = '100%';
  document.getElementById('e-hp').style.width = '100%';
  document.getElementById('btn-fight').innerText = "FIGHTING...";

  let turn = 0;
  const arenaFloor = document.getElementById('arena-floor');
  
  const fightLoop = setInterval(() => {
    turn++;
    const pChar = document.getElementById('p-char-img');
    const eChar = document.getElementById('e-char-img');
    const pPet = document.getElementById('p-pet-img');
    const ePet = document.getElementById('e-pet-img');

    if(turn % 2 !== 0) {
      pChar.classList.add('attack-l');
      pPet.classList.add('pet-lunge-left');
      setTimeout(() => {
        pChar.classList.remove('attack-l');
        eChar.classList.add('hit-flash');
        arenaFloor.classList.add('screen-shake');
        eHpVal -= 25; document.getElementById('e-hp').style.width = `${Math.max(0, eHpVal)}%`;
        showDamage(eChar, 2500);
        if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        setTimeout(() => { eChar.classList.remove('hit-flash'); arenaFloor.classList.remove('screen-shake'); }, 300);
      }, 200);
      setTimeout(() => { pPet.classList.remove('pet-lunge-left'); }, 800);
    } else {
      eChar.classList.add('attack-r');
      ePet.classList.add('pet-lunge-right');
      setTimeout(() => {
        eChar.classList.remove('attack-r');
        pChar.classList.add('hit-flash');
        arenaFloor.classList.add('screen-shake');
        pHpVal -= 20; document.getElementById('p-hp').style.width = `${Math.max(0, pHpVal)}%`;
        showDamage(pChar, 2000);
        if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        setTimeout(() => { pChar.classList.remove('hit-flash'); arenaFloor.classList.remove('screen-shake'); }, 300);
      }, 200);
      setTimeout(() => { ePet.classList.remove('pet-lunge-right'); }, 800);
    }

    if(pHpVal <= 0 || eHpVal <= 0) {
      clearInterval(fightLoop);
      setTimeout(() => {
        if(eHpVal <= 0) { user.iron += 200; alert("VICTORY! +200 Iron"); }
        else { alert("DEFEAT!"); }
        updateUI();
        isFighting = false; document.getElementById('btn-fight').innerText = "START ATTACK";
        nav('outpost', document.querySelector('[data-target="outpost"]'));
      }, 500);
    }
  }, 1000);
}

function showDamage(target, amount) {
  const rect = target.getBoundingClientRect();
  const dmg = document.createElement('div');
  dmg.classList.add('dmg-text'); dmg.innerText = `-${amount}`;
  dmg.style.left = `${rect.left + (rect.width/2) - 30}px`; 
  dmg.style.top = `${rect.top + 40}px`;
  document.body.appendChild(dmg); 
  setTimeout(() => dmg.remove(), 1000);
}

function fightBoss() {
  let bossHp = 5000;
  const btn = document.getElementById('btn-boss');
  if(btn.innerText === "FIGHTING...") return;
  btn.innerText = "FIGHTING...";
  
  let damage = setInterval(() => {
    bossHp -= 500;
    document.getElementById('boss-hp').style.width = `${(bossHp/5000)*100}%`;
    if(bossHp <= 0) {
      clearInterval(damage);
      alert("Boss Defeated! +1000 Iron, +1 Plasma Core");
      user.iron += 1000; user.plasma += 1;
      updateUI(); btn.innerText = "ATTACK BOSS";
    }
  }, 400);
}
