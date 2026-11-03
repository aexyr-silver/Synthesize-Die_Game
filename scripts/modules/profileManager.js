
export let testProfiles = [
  {
    name: 'Chanterelle',
    currentGameMode: 'Dull',
    currentTier: 1,
    points: 0,
    currentCards: [],
    cardsUnlocked: ['void_01'],
  },
  {
    name: 'Derrick',
    currentGameMode: 'Fiery',
    currentTier: 1,
    points: 10,
    currentCards: [],
    cardsUnlocked: ['void_01', 'ember_01'],
  },
];

const storedData = localStorage.getItem('player_data_index');
export let player_data = storedData ? JSON.parse(storedData) : [];

export let activeProfile = null;
export function setActiveProfile(profile) {
  activeProfile = profile;

  if (profile) localStorage.setItem('active_player', profile.name);
  else localStorage.removeItem('active_player');
}
export function saveToStorage() {
  localStorage.setItem('player_data_index', JSON.stringify(player_data));
}

function throwError(code, e = 'Something unexpected happened.') {
  switch (code) {
    case 'addProfile':
      console.error(`[!] Cannot add new profile\nReason: ${e}`);
      break;
  }
}
export function addProfile(rawName, mode = 'Dull') {
  const name = rawName.trim();

  if (!name) {
    throwError('addProfile', 'Name cannot be empty.');
    return null;
  }

  const newProfile = {
    name: name,
    currentGameMode: mode,
    currentTier: 1,
    points: 0,
    currentCards: [],
    cardsUnlocked: ['void_01'],
    diceSynthesis: {
      t1_component: [],
      t2_synthesis: [],
      t3_synthesis: [],
    },
  };

  player_data.push(newProfile);
  saveToStorage();
  console.log(
    `> Profile added to Player Data successfully.\n> ${name} is playing with ${mode} rules.`
  );

  return newProfile;
}

export function removeProfile(name) {
  const dataLength = player_data.length;
  player_data = player_data.filter(
    (p) => p.name.toLowerCase() !== name.toLowerCase()
  );

  if (player_data.length < dataLength) {
    saveToStorage();
    console.log(`> ${name} has been removed from the Player Data successfully.`);

    if (activeProfile && activeProfile.name.toLowerCase() === name.toLowerCase()) {
      activeProfile = null;
    }

    return true;
  }

  return false;
}
