// 1. GAME DATABASE & CONFIG
const gameData = {
  storage: { iron: 100000, titanium: 50000, dm: 5000, pc: 500, gems: 999999 },
  
  buildings: {
    'cc': { name: 'Command Center', img: 'build_command.png', maxLvl: 15, baseCost: { iron: 3000, tita: 1000, dm: 0, pc: 0, gems: 5 }, unlockLvl: 1 },
    'iron_miner': { name: 'Iron Miner', img: 'build_miner_iron.png', type: 'miner', res: 'iron', baseRate: 10, baseCap: 1000, maxLvl: 15, baseCost: { iron: 1000, tita: 0, dm: 0, pc: 0, gems: 2 }, unlockLvl: 1 },
    // FIXED: Renamed to build_storage.png
    'iron_storage': { name: 'Iron Storage', img: 'build_storage.png', type: 'storage', res: 'iron', baseCap: 10000, maxLvl: 15, baseCost: { iron: 800, tita: 0, dm: 0, pc: 0, gems: 2 }, unlockLvl: 1 },
    'lab': { name: 'Research Lab', img: 'build_lab.png', maxLvl: 15, baseCost: { iron: 2500, tita: 800, dm: 0, pc: 0, gems: 5 }, unlockLvl: 1 },
    
    'tita_miner': { name: 'Tita Miner', img: 'build_miner_tita.png', type: 'miner', res: 'titanium', baseRate: 5, baseCap: 500, maxLvl: 15, baseCost: { iron: 2000, tita: 500, dm: 0, pc: 0, gems: 3 }, unlockLvl: 2 },
    'tita_storage': { name: 'Tita Storage', img: 'build_storage_tita.png', type: 'storage', res: 'titanium', baseCap: 5000, maxLvl: 15, baseCost: { iron: 1500, tita: 300, dm: 0, pc: 0, gems: 3 }, unlockLvl: 2 },
    
    'turret': { name: 'Defense Turret', img: 'build_turret.png', maxLvl: 15, baseCost: { iron: 4000, tita: 1000, dm: 0, pc: 0, gems: 8 }, unlockLvl: 3 },
    'shield': { name: 'Shield Generator', img: 'build_shield.png', maxLvl: 15, baseCost: { iron: 5000, tita: 1500, dm: 0, pc: 0, gems: 10 }, unlockLvl: 4 },
    
    'dm_storage': { name: 'DM Storage', img: 'build_storage_dm.png', type: 'storage', res: 'dm', baseCap: 500, maxLvl: 15, baseCost: { iron: 10000, tita: 3000, dm: 50, pc: 0, gems: 15 }, unlockLvl: 5 },
    'dm_miner': { name: 'DM Miner', img: 'build_miner_dm.png', type: 'miner', res: 'dm', baseRate: 1, baseCap: 50, maxLvl: 15, baseCost: { iron: 15000, tita: 4000, dm: 100, pc: 0, gems: 20 }, unlockLvl: 6 },
    'pc_storage': { name: 'PC Storage', img: 'build_storage_pc.png', type: 'storage', res: 'pc', baseCap: 50, maxLvl: 15, baseCost: { iron: 20000, tita: 5000, dm: 200, pc: 5, gems: 25 }, unlockLvl: 6 },
    
    'clan': { name: 'Clan Citadel', img: 'build_clan.png', maxLvl: 15, baseCost: { iron: 50000, tita: 10000, dm: 300, pc: 10, gems: 50 }, unlockLvl: 7 },
    'pet_house': { name: 'Pet House', img: 'build_pet_house.png', maxLvl: 15, baseCost: { iron: 30000, tita: 8000, dm: 150, pc: 5, gems: 40 }, unlockLvl: 8 },
    
    'pc_miner': { name: 'Plasma Miner', img: 'build_miner_pc.png', type: 'miner', res: 'pc', baseRate: 0.1, baseCap: 5, maxLvl: 15, baseCost: { iron: 60000, tita: 15000, dm: 400, pc: 20, gems: 60 }, unlockLvl: 9 },
    
    'turret_heavy': { name: 'Heavy Turret', img: 'build_turret_heavy.png', maxLvl: 15, baseCost: { iron: 100000, tita: 25000, dm: 600, pc: 30, gems: 80 }, unlockLvl: 10 },
    'shield_advanced': { name: 'Advanced Shield', img: 'build_shield_advanced.png', maxLvl: 15, baseCost: { iron: 150000, tita: 40000, dm: 800, pc: 40, gems: 100 }, unlockLvl: 12 },
    
    'orbital_cannon': { name: 'Orbital Cannon', img: 'build_orbital_cannon.png', maxLvl: 15, baseCost: { iron: 500000, tita: 100000, dm: 2000, pc: 100, gems: 250 }, unlockLvl: 15 }
  }
};

// 2. INITIAL STATE
let state = JSON.parse(localStorage.getItem('aetherfall_state')) || {
  ccLevel: 1,
  resources: { gems: 500, iron: 15000, titanium: 2000, dm: 100, pc: 10 }, // Increased starting iron
  buildersTotal: 1,
  placedBuildings: [
    { id: 'b_1', type: 'cc', level: 1, x: 50, y: 50 },
    { id: 'b_2', type: 'iron_miner', level: 1, x: 30, y: 30, currentAmount: 0 },
    { id: 'b_3', type: 'iron_miner', level: 1, x: 70, y: 30, currentAmount: 0 },
    { id: 'b_4', type: 'iron_storage', level: 1, x: 30, y: 70 },
    { id: 'b_5', type: 'lab', level: 1, x: 70, y: 70 }
  ]
};

function saveGame() { localStorage.setItem('aetherfall_state', JSON.stringify(state)); }

// 3. UTILITIES
function getUpgradeCost(type, currentLevel) {
  const base = gameData.buildings[type].baseCost;
  const multiplier = Math.pow(1.5, currentLevel - 1); 
  return {
    iron: Math.floor(base.iron * multiplier),
    tita: Math.floor(base.tita * multiplier),
    dm: Math.floor(base.dm * multiplier),
    pc: Math.floor(base.pc * multiplier),
    gems: Math.floor(base.gems * multiplier)
  };
}

// CoC Style Exponential Upgrade Time
function getUpgradeTime(type, level) {
  // Base time in seconds: 5 seconds for level 1 to 2. 
  // Multiplier: 1.6^level
  const baseTime = 5; 
  let time = baseTime * Math.pow(1.6, level - 1);
  if (type === 'cc') time *= 2; // CC takes twice as long
  
  // Add random variance based on building type
  return Math.floor(time); // in seconds
}

function formatTime(seconds) {
  if(seconds <= 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  let str = "";
  if (h > 0) str += `${h}h `;
  if (m > 0) str += `${m}m `;
  if (s > 0) str += `${s}s`;
  return str.trim();
}

function getMinerStats(type, level) {
  const data = gameData.buildings[type];
  const multiplier = Math.pow(1.2, level - 1); 
  return {
    rate: data.baseRate * multiplier,
    cap: Math.floor(data.baseCap * multiplier)
  };
}

// 4. UI UPDATER
function updateUI() {
  document.getElementById('ui-gems').innerText = Math.floor(state.resources.gems);
  document.getElementById('ui-iron').innerText = Math.floor(state.resources.iron);
  document.getElementById('ui-tita').innerText = Math.floor(state.resources.titanium);
  document.getElementById('ui-dm').innerText = Math.floor(state.resources.dm);
  document.getElementById('ui-pc').innerText = Math.floor(state.resources.pc);
  document.getElementById('ui-cc-level').innerText = state.ccLevel;
  document.getElementById('ui-builder-text').innerText = `${state.buildersTotal} / 3 Builders`;

  const container = document.getElementById('building-container');
  container.innerHTML = '';
  
  state.placedBuildings.forEach(b => {
    const data = gameData.buildings[b.type];
    let isReady = false;
    let isUpgrading = b.finishTime && b.finishTime > Date.now();
    
    if (data.type === 'miner' && !isUpgrading) {
      const stats = getMinerStats(b.type, b.level);
      if (b.currentAmount >= stats.cap) isReady = true;
    }

    const el = document.createElement('div');
    el.className = `building-node ${isReady ? 'ready' : ''} ${isUpgrading ? 'upgrading' : ''}`;
    el.style.left = `${b.x}%`;
    el.style.top = `${b.y}%`;
    el.id = b.id;
    
    let timerText = '';
    if(isUpgrading) {
      const remaining = Math.floor((b.finishTime - Date.now()) / 1000);
      timerText = `<div class="upgrade-timer" id="timer_${b.id}">🛠️ ${formatTime(remaining)}</div>`;
    }

    el.innerHTML = `
      ${timerText}
      <img src="assets/${data.img}" class="building-img">
    `;
    
    let isDragging = false;
    let startX, startY;
    
    el.addEventListener('pointerdown', (e) => {
      if (isUpgrading) return; // Can't drag while upgrading
      startX = e.clientX; startY = e.clientY;
      isDragging = false;
      el.classList.add('dragging');
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
      if (!el.hasPointerCapture(e.pointerId) || isUpgrading) return;
      if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
        isDragging = true;
        const mapRect = document.getElementById('base-map').getBoundingClientRect();
        let newX = ((e.clientX - mapRect.left) / mapRect.width) * 100;
        let newY = ((e.clientY - mapRect.top) / mapRect.height) * 100;
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));
        el.style.left = `${newX}%`; el.style.top = `${newY}%`;
        b.x = newX; b.y = newY;
      }
    });

    el.addEventListener('pointerup', (e) => {
      el.classList.remove('dragging');
      el.releasePointerCapture(e.pointerId);
      if (isDragging) {
        saveGame();
      } else {
        openBuildingModal(b);
      }
    });

    container.appendChild(el);
  });
}

// 5. MODAL LOGIC
let currentSelectedBuildingId = null;

function openBuildingModal(building) {
  currentSelectedBuildingId = building.id;
  const data = gameData.buildings[building.type];
  const isUpgrading = building.finishTime && building.finishTime > Date.now();
  
  document.getElementById('b-modal-title').innerText = data.name;
  document.getElementById('b-modal-img').src = `assets/${data.img}`;
  document.getElementById('b-modal-level').innerText = building.level;
  
  const statLabel = document.getElementById('b-modal-stat-label');
  const statVal = document.getElementById('b-modal-stat-val');
  const upgradeInfo = document.getElementById('b-modal-upgrade-info');
  const storageRow = document.getElementById('b-modal-storage-row');
  const timeRow = document.getElementById('b-modal-time-row');
  const claimBtn = document.getElementById('btn-claim');
  const btnUpgrade = document.getElementById('btn-upgrade');

  // Base Data
  if (data.type === 'miner') {
    const stats = getMinerStats(building.type, building.level);
    statLabel.innerText = "Production:";
    statVal.innerText = `${stats.rate.toFixed(1)} / min`;
    storageRow.style.display = 'flex';
    document.getElementById('b-modal-storage').innerText = `${Math.floor(building.currentAmount)} / ${stats.cap}`;
    claimBtn.style.display = isUpgrading ? 'none' : 'block';
    claimBtn.innerText = `CLAIM ${data.res.toUpperCase()}`;
    
    if(building.level < 15) {
      const nextStats = getMinerStats(building.type, building.level + 1);
      upgradeInfo.style.display = 'block';
      document.getElementById('next-stat-val').innerText = `${nextStats.rate.toFixed(1)} / min (Cap: ${nextStats.cap})`;
    } else {
      upgradeInfo.style.display = 'none';
    }
  } else {
    statLabel.innerText = "Type:";
    statVal.innerText = data.type ? data.type.toUpperCase() : 'Utility';
    storageRow.style.display = 'none';
    claimBtn.style.display = 'none';
    upgradeInfo.style.display = 'none';
  }

  // Upgrade Logic
  if (isUpgrading) {
    // Show remaining time
    timeRow.style.display = 'flex';
    const rem = Math.floor((building.finishTime - Date.now()) / 1000);
    document.getElementById('b-modal-time').innerText = formatTime(rem);
    
    document.getElementById('b-modal-cost-container').style.display = 'none';
    btnUpgrade.style.display = 'none';
  } else {
    timeRow.style.display = 'none';
    document.getElementById('b-modal-cost-container').style.display = 'block';
    btnUpgrade.style.display = 'block';
    btnUpgrade.innerText = "UPGRADE";

    if (building.level >= 15) {
      document.getElementById('b-modal-costs').innerHTML = `<span style="color:var(--gold);">MAX LEVEL REACHED</span>`;
      btnUpgrade.style.display = 'none';
    } else {
      const cost = getUpgradeCost(building.type, building.level);
      const timeReq = getUpgradeTime(building.type, building.level);
      
      let costHtml = '';
      if(cost.iron > 0) costHtml += `<div class="cost-item"><img src="assets/icon_iron.png"> ${cost.iron}</div>`;
      if(cost.tita > 0) costHtml += `<div class="cost-item"><img src="assets/icon_titanium.png"> ${cost.tita}</div>`;
      if(cost.dm > 0) costHtml += `<div class="cost-item"><img src="assets/icon_dm.png"> ${cost.dm}</div>`;
      if(cost.pc > 0) costHtml += `<div class="cost-item"><img src="assets/icon_pc.png"> ${cost.pc}</div>`;
      if(cost.gems > 0) costHtml += `<div class="cost-item"><img src="assets/icon_gem.png"> ${cost.gems}</div>`;
      
      document.getElementById('b-modal-costs').innerHTML = costHtml;
      
      // Show time required
      timeRow.style.display = 'flex';
      document.getElementById('b-modal-time').innerText = formatTime(timeReq);
    }
  }

  document.getElementById('building-modal').style.display = 'flex';
}

// 6. CLAIM LOGIC
function claimResources() {
  const building = state.placedBuildings.find(b => b.id === currentSelectedBuildingId);
  if(building.finishTime && building.finishTime > Date.now()) return; // Can't claim while upgrading

  const data = gameData.buildings[building.type];
  const resType = data.res;
  let amount = building.currentAmount;
  
  if (amount <= 0) { alert("Miner is empty!"); return; }

  const currentGlobal = state.resources[resType];
  const cap = gameData.storage[resType]; 
  
  if (currentGlobal >= cap) { alert("Main Storage is full! Upgrade your storage first."); return; }

  let newTotal = currentGlobal + amount;
  if (newTotal > cap) { amount = cap - currentGlobal; newTotal = cap; }

  state.resources[resType] = newTotal;
  building.currentAmount -= amount;
  
  saveGame(); updateUI(); closeModals();
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  alert(`Successfully claimed ${Math.floor(amount)} ${resType.toUpperCase()}!`);
}

// 7. UPGRADE LOGIC (Starts Timer)
function upgradeBuilding() {
  const building = state.placedBuildings.find(b => b.id === currentSelectedBuildingId);
  if (building.level >= 15) return;

  // Check CC Lock Constraint
  if (building.type === 'cc') {
    // Check if ALL other buildings are upgraded to current CC level
    const notMaxed = state.placedBuildings.some(b => b.type !== 'cc' && b.level < state.ccLevel);
    if (notMaxed) {
      alert("You must upgrade all other buildings to your current Command Center level first!");
      return;
    }
  } else {
    // Check if building exceeds CC level
    if (building.level >= state.ccLevel) {
      alert("Upgrade your Command Center first to unlock higher levels for this building!");
      return;
    }
  }

  const cost = getUpgradeCost(building.type, building.level);
  
  if (state.resources.iron >= cost.iron && state.resources.titanium >= cost.tita && state.resources.dm >= cost.dm && state.resources.pc >= cost.pc && state.resources.gems >= cost.gems) {
    // Deduct
    state.resources.iron -= cost.iron;
    state.resources.titanium -= cost.tita;
    state.resources.dm -= cost.dm;
    state.resources.pc -= cost.pc;
    state.resources.gems -= cost.gems;
    
    // Start Timer
    const timeReq = getUpgradeTime(building.type, building.level);
    building.finishTime = Date.now() + (timeReq * 1000);
    
    saveGame(); updateUI(); closeModals();
    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  } else {
    alert("Not enough resources!");
  }
}

// 8. BUILD MENU
function openBuildMenu() {
  const grid = document.getElementById('build-grid');
  grid.innerHTML = '';
  
  for (let type in gameData.buildings) {
    const data = gameData.buildings[type];
    if (type === 'cc' && state.placedBuildings.some(b => b.type === 'cc')) continue;
    
    const isUnlocked = state.ccLevel >= data.unlockLvl;
    
    let card = document.createElement('div');
    card.className = `build-card ${!isUnlocked ? 'locked' : ''}`;
    card.innerHTML = `
      <img src="assets/${data.img}">
      <p>${data.name}</p>
      ${!isUnlocked ? `<div class="lock-overlay"><span>🔒 CC Lvl ${data.unlockLvl}</span></div>` : ''}
    `;
    
    if (isUnlocked) {
      card.onclick = () => {
        // Instant place
        const newX = 20 + Math.random() * 60;
        const newY = 20 + Math.random() * 60;
        const newB = { id: 'b_' + Date.now(), type: type, level: 1, x: newX, y: newY, currentAmount: 0 };
        const cost = getUpgradeCost(type, 0);
        
        if (state.resources.iron >= cost.iron && state.resources.gems >= cost.gems) {
           state.resources.iron -= cost.iron; state.resources.gems -= cost.gems;
           state.placedBuildings.push(newB);
           saveGame(); updateUI(); closeModals();
        } else {
           alert("Not enough resources to build!");
        }
      };
    }
    grid.appendChild(card);
  }
  document.getElementById('build-menu-modal').style.display = 'flex';
}

function closeModals() {
  document.getElementById('build-menu-modal').style.display = 'none';
  document.getElementById('building-modal').style.display = 'none';
}

// 9. MAIN GAME LOOP
setInterval(() => {
  let changed = false;
  const now = Date.now();

  state.placedBuildings.forEach(b => {
    const data = gameData.buildings[b.type];
    
    // Check if upgrade finished
    if (b.finishTime && now >= b.finishTime) {
      b.level++;
      b.finishTime = null;
      if (b.type === 'cc') {
        state.ccLevel = b.level;
        if(state.ccLevel === 5) state.buildersTotal = 2;
        if(state.ccLevel === 10) state.buildersTotal = 3;
      }
      changed = true;
    }
    
    // Mine resources (only if not upgrading)
    if (data.type === 'miner' && !b.finishTime) {
      const stats = getMinerStats(b.type, b.level);
      if (b.currentAmount < stats.cap) {
        b.currentAmount += (stats.rate / 60);
        if (b.currentAmount > stats.cap) b.currentAmount = stats.cap;
        changed = true;
      }
    }
  });

  // Update timer text on screen without re-rendering everything
  if (!changed) {
    state.placedBuildings.forEach(b => {
      if (b.finishTime) {
        const el = document.getElementById(`timer_${b.id}`);
        if (el) {
          const rem = Math.floor((b.finishTime - now) / 1000);
          if (rem > 0) el.innerHTML = `🛠️ ${formatTime(rem)}`;
        }
      }
    });
  }

  if (changed) { saveGame(); updateUI(); }
}, 1000);

// 10. SIGNUP BONUS POPUP
window.onload = () => {
  setTimeout(() => { document.getElementById('loading').classList.add('hide'); }, 1500);
  
  if (!localStorage.getItem('has_claimed_bonus')) {
    document.getElementById('signup-modal').style.display = 'flex';
  } else {
    updateUI();
  }
};

function claimSignupBonus() {
  state.resources.gems += 100;
  state.resources.iron += 100000;
  state.resources.titanium += 10000;
  state.resources.dm += 100;
  state.resources.pc += 10;
  
  localStorage.setItem('has_claimed_bonus', 'true');
  saveGame();
  updateUI();
  document.getElementById('signup-modal').style.display = 'none';
  
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
}
