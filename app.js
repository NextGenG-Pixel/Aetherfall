// Telegram Init
if (window.Telegram) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

// 1. STATE MANAGEMENT (নতুন ইউজার - শুধু Normal আনলকড)
let user = {
  power: 150,
  gems: 50,
  iron: 1000,
  plasma: 10,
  equipped: {
    char: 'char_default',
    weapon: 'wep_rifle_normal',
    pet: 'pet_dog_normal',
    armor: 'arm_vest_normal'
  },
  unlockedItems: ['char_default', 'wep_rifle_normal', 'pet_dog_normal', 'arm_vest_normal']
};

// সব আইটেমের ডাটাবেস
const allGameItems = [
  // Characters
  { id: 'char_default', name: 'Cadet', type: 'char', rarity: 'normal', power: 100 },
  { id: 'char_epic', name: 'Cyber Ninja', type: 'char', rarity: 'epic', power: 500 },
  { id: 'char_legendary', name: 'Warlord', type: 'char', rarity: 'legendary', power: 1500 },
  // Weapons
  { id: 'wep_rifle_normal', name: 'Std Rifle', type: 'weapon', rarity: 'normal', power: 50 },
  { id: 'wep_rifle_epic', name: 'Plasma Rifle', type: 'weapon', rarity: 'epic', power: 300 },
  { id: 'wep_rifle_legendary', name: 'Nova Blaster', type: 'weapon', rarity: 'legendary', power: 800 },
  // Pets
  { id: 'pet_dog_normal', name: 'Cyber Dog', type: 'pet', rarity: 'normal', power: 50 },
  { id: 'pet_tiger_epic', name: 'Mecha Tiger', type: 'pet', rarity: 'epic', power: 400 },
  { id: 'pet_dragon_legendary', name: 'Mecha Dragon', type: 'pet', rarity: 'legendary', power: 1000 },
  // Armor
  { id: 'arm_vest_normal', name: 'Basic Vest', type: 'armor', rarity: 'normal', power: 50 },
  { id: 'arm_vest_mythic', name: 'Titan Armor', type: 'armor', rarity: 'mythic', power: 2000 }
];

let selectedItem = null;

// 2. INITIALIZATION
window.onload = () => {
  setTimeout(() => { 
    document.getElementById('loading').classList.add('hide'); 
    updateUI(); 
  }, 1500);
};

// 3. UI UPDATER
function updateUI() {
  // Update Resources
  document.getElementById('ui-gems').innerText = user.gems;
  document.getElementById('ui-iron').innerText = user.iron;
  document.getElementById('ui-pc').innerText = user.plasma;
  
  // Calculate Total Power
  let total = 0;
  for (let type in user.equipped) {
    let item = allGameItems.find(i => i.id === user.equipped[type]);
    if(item) total += item.power;
  }
  user.power = total;
  document.getElementById('ui-total-power').innerText = `POWER: ${user.power}`;
  
  // Update Outpost HUD Slots
  document.getElementById('ui-slot-wep').src = `assets/${user.equipped.weapon}.png`;
  document.getElementById('ui-slot-pet').src = `assets/${user.equipped.pet}.png`;

  // Update Battle Screen Images (Dynamic Loading)
  document.getElementById('p-char-img').src = `assets/${user.equipped.char}_left.png`;
  document.getElementById('p-pet-img').src = `assets/${user.equipped.pet}_attack.png`;

  renderArmory();
}

// 4. NAVIGATION
function nav(screenId, btnElement) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if(btnElement) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
}

// 5. ARMORY & LOCK/UNLOCK LOGIC
function renderArmory() {
  const grid = document.getElementById('ui-inventory');
  grid.innerHTML = allGameItems.map(item => {
    const isUnlocked = user.unlockedItems.includes(item.id);
    const isEquipped = user.equipped[item.type] === item.id;
    
    let cardClass = isUnlocked ? `card-${item.rarity}` : 'card-locked';
    let lockIcon = isUnlocked ? '' : '<i class="ph-fill ph-lock-key lock-icon"></i>';
    let equippedText = isEquipped ? '<div style="color:var(--green); font-size:10px; font-weight:bold; margin-top:5px;">EQUIPPED</div>' : '';
    
    return `
      <div class="item-card ${cardClass}" onclick="handleItemClick('${item.id}')">
        ${lockIcon}
        <img src="assets/${item.id}.png" onerror="this.src='https://via.placeholder.com/80/333/fff?text=?'">
        <div class="name" style="font-family:'Orbitron'; font-size:12px;">${item.name}</div>
        <div class="power" style="color:var(--gold); font-family:'Teko'; font-size:18px;">${item.power} PWR</div>
        ${equippedText}
      </div>
    `;
  }).join('');
}

function handleItemClick(id) {
  const item = allGameItems.find(i => i.id === id);
  const isUnlocked = user.unlockedItems.includes(id);
  
  if (!isUnlocked) {
    // Show Unlock Modal
    selectedItem = item;
    document.getElementById('upgrade-modal').style.display = 'flex';
    document.getElementById('modal-img').src = `assets/${id}.png`;
    document.getElementById('modal-title').innerText = `UNLOCK ${item.name.toUpperCase()}`;
    document.getElementById('modal-desc').innerHTML = `Cost: <span style="color:gold;">500 Iron + 2 Plasma</span>`;
    
    let btn = document.getElementById('btn-modal-action');
    btn.innerText = "UNLOCK NOW";
    btn.onclick = unlockItem;
  } else {
    // Equip directly
    user.equipped[item.type] = item.id;
    updateUI();
    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  }
}

function unlockItem() {
  if(user.iron >= 500 && user.plasma >= 2) {
    user.iron -= 500;
    user.plasma -= 2;
    user.unlockedItems.push(selectedItem.id);
    updateUI();
  } else {
    alert("Not enough materials! Go defeat bosses in the Sector.");
  }
  closeModal();
}

function closeModal() { document.getElementById('upgrade-modal').style.display = 'none'; }

// 6. PVP BATTLE LOGIC (Dynamic + Pets)
let isFighting = false, pHpVal = 100, eHpVal = 100;

function startBattle() {
  if(isFighting) return;
  isFighting = true;
  pHpVal = 100; eHpVal = 100;
  document.getElementById('p-hp').style.width = '100%';
  document.getElementById('e-hp').style.width = '100%';
  document.getElementById('btn-fight').innerText = "FIGHTING...";

  let turn = 0;
  const fightLoop = setInterval(() => {
    turn++;
    const pChar = document.getElementById('p-char-img');
    const eChar = document.getElementById('e-char-img');
    const pPet = document.getElementById('p-pet-img');
    const ePet = document.getElementById('e-pet-img');

    if(turn % 2 !== 0) {
      // Player Attack
      pChar.classList.add('attack-l');
      pPet.classList.add('pet-lunge-left');
      
      setTimeout(() => {
        pChar.classList.remove('attack-l');
        eChar.classList.add('shake');
        eHpVal -= 25; document.getElementById('e-hp').style.width = `${Math.max(0, eHpVal)}%`;
        showDamage(eChar, 2500);
        setTimeout(() => eChar.classList.remove('shake'), 300);
      }, 200);
      setTimeout(() => { pPet.classList.remove('pet-lunge-left'); }, 800);

    } else {
      // Enemy Attack
      eChar.classList.add('attack-r');
      ePet.classList.add('pet-lunge-right');
      
      setTimeout(() => {
        eChar.classList.remove('attack-r');
        pChar.classList.add('shake');
        pHpVal -= 20; document.getElementById('p-hp').style.width = `${Math.max(0, pHpVal)}%`;
        showDamage(pChar, 2000);
        setTimeout(() => pChar.classList.remove('shake'), 300);
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
        nav('outpost', document.querySelectorAll('.nav-btn')[0]);
      }, 500);
    }
  }, 1000);
}

// 7. PVE BOSS LOGIC
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

// Helper: Damage Numbers
function showDamage(target, amount) {
  const rect = target.getBoundingClientRect();
  const dmg = document.createElement('div');
  dmg.classList.add('dmg-text'); dmg.innerText = `-${amount}`;
  dmg.style.left = `${rect.left + (rect.width/2) - 20}px`; 
  dmg.style.top = `${rect.top}px`;
  document.body.appendChild(dmg); 
  setTimeout(() => dmg.remove(), 1000);
}
