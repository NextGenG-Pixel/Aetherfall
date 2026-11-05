// 1. GAME DATABASE & CONFIG
const gameData = {
  // Max Storage Capacities
  storage: { iron: 10000, titanium: 5000, dm: 500, pc: 50, gems: 999999 },
  
  // All Building Data
  buildings: {
    'cc': { name: 'Command Center', img: 'build_command.png', maxLvl: 15, baseCost: { iron: 3000, tita: 1000, dm: 0, pc: 0, gems: 5 }, unlockLvl: 1 },
    'iron_miner': { name: 'Iron Miner', img: 'build_miner_iron.png', type: 'miner', res: 'iron', baseRate: 10, baseCap: 1000, maxLvl: 15, baseCost: { iron: 1000, tita: 0, dm: 0, pc: 0, gems: 2 }, unlockLvl: 1 },
    'iron_storage': { name: 'Iron Storage', img: 'build_storage_iron.png', type: 'storage', res: 'iron', baseCap: 10000, maxLvl: 15, baseCost: { iron: 800, tita: 0, dm: 0, pc: 0, gems: 2 }, unlockLvl: 1 },
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

// 2. INITIAL STATE (Loaded from LocalStorage if exists)
let state = JSON.parse(localStorage.getItem('aetherfall_state')) || {
  ccLevel: 1,
  resources: { gems: 500, iron: 5000, titanium: 2000, dm: 100, pc: 10 },
  buildersTotal: 1,
  buildersBusy: 0,
  placedBuildings: [
    // Default starting buildings
    { id: 'b_1', type: 'cc', level: 1, x: 50, y: 50 },
    { id: 'b_2', type: 'iron_miner', level: 1, x: 30, y: 30, currentAmount: 0 },
    { id: 'b_3', type: 'iron_miner', level: 1, x: 70, y: 30, currentAmount: 0 },
    { id: 'b_4', type: 'iron_storage', level: 1, x: 30, y: 70 },
    { id: 'b_5', type: 'lab', level: 1, x: 70, y: 70 }
  ]
};

function saveGame() {
  localStorage.setItem('aetherfall_state', JSON.stringify(state));
}

// 3. UTILITIES & CALCULATIONS
function getUpgradeCost(type, currentLevel) {
  const base = gameData.buildings[type].baseCost;
  const multiplier = Math.pow(1.5, currentLevel - 1); // Cost increases by 50% per level
  
  return {
    iron: Math.floor(base.iron * multiplier),
    tita: Math.floor(base.tita * multiplier),
    dm: Math.floor(base.dm * multiplier),
    pc: Math.floor(base.pc * multiplier),
    gems: Math.floor(base.gems * multiplier)
  };
}

function getMinerStats(type, level) {
  const data = gameData.buildings[type];
  // Rate and Cap increase by 20% per level
  const multiplier = Math.pow(1.2, level - 1); 
  return {
    rate: data.baseRate * multiplier, // per minute
    cap: Math.floor(data.baseCap * multiplier)
  };
}

// 4. UI UPDATER
function updateUI() {
  // Update HUD
  document.getElementById('ui-gems').innerText = Math.floor(state.resources.gems);
  document.getElementById('ui-iron').innerText = Math.floor(state.resources.iron);
  document.getElementById('ui-tita').innerText = Math.floor(state.resources.titanium);
  document.getElementById('ui-dm').innerText = Math.floor(state.resources.dm);
  document.getElementById('ui-pc').innerText = Math.floor(state.resources.pc);
  document.getElementById('ui-cc-level').innerText = state.ccLevel;
  document.getElementById('ui-builder-text').innerText = `${state.buildersTotal} / 3 Builders`;

  // Render Buildings
  const container = document.getElementById('building-container');
  container.innerHTML = '';
  
  state.placedBuildings.forEach(b => {
    const data = gameData.buildings[b.type];
    let isReady = false;
    
    if (data.type === 'miner') {
      const stats = getMinerStats(b.type, b.level);
      if (b.currentAmount >= stats.cap) isReady = true;
    }

    const el = document.createElement('div');
    el.className = `building-node ${isReady ? 'ready' : ''}`;
    el.style.left = `${b.x}%`;
    el.style.top = `${b.y}%`;
    el.id = b.id;
    
    el.innerHTML = `
      <img src="assets/${data.img}" class="building-img">
    `;
    
    // Click & Drag Logic
    let isDragging = false;
    let startX, startY;
    
    el.addEventListener('pointerdown', (e) => {
      startX = e.clientX; startY = e.clientY;
      isDragging = false;
      el.classList.add('dragging');
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
        isDragging = true;
        const mapRect = document.getElementById('base-map').getBoundingClientRect();
        let newX = ((e.clientX - mapRect.left) / mapRect.width) * 100;
        let newY = ((e.clientY - mapRect.top) / mapRect.height) * 100;
        
        // Clamp to screen
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));
        
        el.style.left = `${newX}%`;
        el.style.top = `${newY}%`;
        b.x = newX;
        b.y = newY;
      }
    });

    el.addEventListener('pointerup', (e) => {
      el.classList.remove('dragging');
      el.releasePointerCapture(e.pointerId);
      if (isDragging) {
        saveGame(); // Save new position
      } else {
        // It was a click, open modal
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
  
  document.getElementById('b-modal-title').innerText = data.name;
  document.getElementById('b-modal-img').src = `assets/${data.img}`;
  document.getElementById('b-modal-level').innerText = building.level;
  
  // Handle Miner vs Storage vs Other
  const prodLabel = document.getElementById('b-modal-prod-label');
  const storageRow = document.getElementById('b-modal-storage-row');
  const claimBtn = document.getElementById('btn-claim');
  
  if (data.type === 'miner') {
    const stats = getMinerStats(building.type, building.level);
    prodLabel.innerText = "Production:";
    document.getElementById('b-modal-prod').innerText = `${stats.rate.toFixed(1)} / min`;
    storageRow.style.display = 'flex';
    document.getElementById('b-modal-storage').innerText = `${Math.floor(building.currentAmount)} / ${stats.cap}`;
    claimBtn.style.display = 'block';
    claimBtn.innerText = `CLAIM ${data.res.toUpperCase()}`;
  } else {
    prodLabel.innerText = "Type:";
    document.getElementById('b-modal-prod').innerText = data.type ? data.type.toUpperCase() : 'Utility';
    storageRow.style.display = 'none';
    claimBtn.style.display = 'none';
  }

  // Calculate Upgrade Costs
  if (building.level >= 15) {
    document.getElementById('b-modal-costs').innerHTML = `<span style="color:var(--gold);">MAX LEVEL REACHED</span>`;
  } else {
    const cost = getUpgradeCost(building.type, building.level);
    let costHtml = '';
    if(cost.iron > 0) costHtml += `<div class="cost-item"><img src="assets/icon_iron.png"> ${cost.iron}</div>`;
    if(cost.tita > 0) costHtml += `<div class="cost-item"><img src="assets/icon_titanium.png"> ${cost.tita}</div>`;
    if(cost.dm > 0) costHtml += `<div class="cost-item"><img src="assets/icon_dm.png"> ${cost.dm}</div>`;
    if(cost.pc > 0) costHtml += `<div class="cost-item"><img src="assets/icon_pc.png"> ${cost.pc}</div>`;
    if(cost.gems > 0) costHtml += `<div class="cost-item"><img src="assets/icon_gem.png"> ${cost.gems}</div>`;
    
    document.getElementById('b-modal-costs').innerHTML = costHtml;
  }

  document.getElementById('building-modal').style.display = 'flex';
}

// 6. CLAIM LOGIC
function claimResources() {
  const building = state.placedBuildings.find(b => b.id === currentSelectedBuildingId);
  const data = gameData.buildings[building.type];
  const resType = data.res;
  
  let amount = building.currentAmount;
  
  if (amount <= 0) {
    alert("Miner is empty!");
    return;
  }

  // Check global cap
  const currentGlobal = state.resources[resType];
  const cap = gameData.storage[resType]; // Simplified: using fixed global cap for now
  
  if (currentGlobal >= cap) {
    alert("Main Storage is full! Upgrade your storage first.");
    return;
  }

  // Add to global, cap it
  let newTotal = currentGlobal + amount;
  if (newTotal > cap) {
    amount = cap - currentGlobal;
    newTotal = cap;
  }

  state.resources[resType] = newTotal;
  building.currentAmount -= amount;
  
  saveGame();
  updateUI();
  closeModals();
  
  if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  alert(`Successfully claimed ${Math.floor(amount)} ${resType.toUpperCase()}!`);
}

// 7. UPGRADE LOGIC
function upgradeBuilding() {
  const building = state.placedBuildings.find(b => b.id === currentSelectedBuildingId);
  if (building.level >= 15) return;

  const cost = getUpgradeCost(building.type, building.level);
  
  // Check affordability
  if (state.resources.iron >= cost.iron &&
      state.resources.titanium >= cost.tita &&
      state.resources.dm >= cost.dm &&
      state.resources.pc >= cost.pc &&
      state.resources.gems >= cost.gems) {
        
    // Deduct
    state.resources.iron -= cost.iron;
    state.resources.titanium -= cost.tita;
    state.resources.dm -= cost.dm;
    state.resources.pc -= cost.pc;
    state.resources.gems -= cost.gems;
    
    // Increase Level
    building.level++;
    
    // If CC is upgraded, update global CC level
    if (building.type === 'cc') {
      state.ccLevel = building.level;
      if(state.ccLevel === 5) state.buildersTotal = 2; // Unlock builder 2
      if(state.ccLevel === 10) state.buildersTotal = 3; // Unlock builder 3
    }

    saveGame();
    updateUI();
    openBuildingModal(building); // Refresh modal
    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  } else {
    alert("Not enough resources!");
  }
}

// 8. BUILD MENU LOGIC
function openBuildMenu() {
  const grid = document.getElementById('build-grid');
  grid.innerHTML = '';
  
  // Create a menu of available buildings
  for (let type in gameData.buildings) {
    const data = gameData.buildings[type];
    
    // Skip Command Center, only 1 allowed
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
        // Instant place in a random spot
        const newX = 20 + Math.random() * 60;
        const newY = 20 + Math.random() * 60;
        
        const newB = { id: 'b_' + Date.now(), type: type, level: 1, x: newX, y: newY, currentAmount: 0 };
        
        // Deduct initial building cost (using level 0 cost formula)
        const cost = getUpgradeCost(type, 0);
        
        if (state.resources.iron >= cost.iron && state.resources.gems >= cost.gems) {
           state.resources.iron -= cost.iron;
           state.resources.gems -= cost.gems;
           state.placedBuildings.push(newB);
           saveGame();
           updateUI();
           closeModals();
           if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
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

// 9. GAME LOOP (Ticking every second)
setInterval(() => {
  let changed = false;
  
  state.placedBuildings.forEach(b => {
    const data = gameData.buildings[b.type];
    if (data.type === 'miner') {
      const stats = getMinerStats(b.type, b.level);
      // If not full, mine
      if (b.currentAmount < stats.cap) {
        // Add (rate/60) because rate is per minute and loop is per second
        b.currentAmount += (stats.rate / 60);
        if (b.currentAmount > stats.cap) b.currentAmount = stats.cap;
        changed = true;
      }
    }
  });
  
  if (changed) {
    // We don't save every second to save performance, 
    // but we need to update visual readiness.
    // Only updating UI if a modal is open or visually checking.
    // For a real game, we'd update the specific nodes.
    // For now, we just silently add, and UI updates on claim/refresh.
    saveGame(); 
  }
}, 1000);

// Initialization
window.onload = () => {
  setTimeout(() => { document.getElementById('loading').classList.add('hide'); }, 1500);
  updateUI();
};
