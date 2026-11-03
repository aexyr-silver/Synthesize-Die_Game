// ====================
// 🎲 SYNTHESIZE: DIE
// ====================

window.currentName = '';
window.introSequence = 0;

import {
  currentState,
  setState,
  focusIndex,
  setFocus,
  totalOptions,
  renderActiveState,
  GAME_MODES,
  skipStates,
  inputStates,
} from './modules/stateManager.js';

import {
  player_data,
  activeProfile,
  setActiveProfile,
  addProfile,
  removeProfile
} from './modules/profileManager.js';

import {
  initializeCardRegistry,
  card_registry
} from './modules/cardsManager.js';

var isWithNav = false;
var fades = false;

function confirmActiveSelection() {
  isWithNav = true;
  fades = false;

  switch (currentState) {
    case 'PLAYER_SELECT':
      /* Player Selection Logic */
      if (focusIndex === player_data.length) {
        window.currentName = '';
        window.introSequence = 0;
        setState('NAME_INPUT');
        isWithNav = false;
        fades = true;
      } else {
        setActiveProfile(player_data[focusIndex]);
        setState('MAIN_MENU');
        isWithNav = true;
        fades = true;
      }

      setFocus(0);
      break;

    case 'NAME_INPUT':
      /* Player Creation (Name) Logic */
      if (window.introSequence === 0 || window.introSequence === 1) {
        window.introSequence = window.introSequence + 1;
      } else if (window.introSequence === 2) {
        if (window.currentName.trim() !== '') {
          setState('MODE_INPUT');
        }
      }
      fades = true;
      isWithNav = false;
      setFocus(0);
      break;

    case 'MODE_INPUT':
      /* Player Creation (Mode) Logic */
      const mode = GAME_MODES[focusIndex].name;
      const profile = addProfile(window.currentName, mode);

      if (profile) {
        setActiveProfile(profile);
        setState('MAIN_MENU');
      } else {
        setState('PLAYER_SELECT');
      }
      fades = true;
      isWithNav = true;
      setFocus(0);
      break;

    case 'MAIN_MENU':
      /* Main Menu Logic */
      if (focusIndex === 1) {
        setState('CARDS_MENU');
        isWithNav = false;
        fades = true;
      } else if (focusIndex === 2) {
        setState('PLAYER_SELECT');
        setActiveProfile(null);
        fades = true;
        isWithNav = false;
      } else if (focusIndex === 3) {
        setState('PLAYER_SELECT');
        removeProfile(activeProfile.name);
        setActiveProfile(null);
        fades = true;
        isWithNav = false;
      } else if (focusIndex === 4) {
        document.getElementById(
          'main-space'
        ).innerHTML = `<h1 style="color: aqua; align: center; !important">Disconnected.</h1>`;
        return;
      }
      setFocus(0);
      break;

    case 'CARDS_MENU':
      /* Card Collection Menu Logic */
      if (focusIndex === totalOptions - 1) {
        setState('MAIN_MENU');
        fades = true;
        isWithNav = true;
        setFocus(1);
      }
      else {
        fades = true;
        isWithNav = false;
      }
      break;

    case 'PRE_MATCH':
      /* Die Rolling (Forging the Die) Logic */
      fades = false;
      isWithNav = false;
      setFocus(0);
      break;

    case 'BATTLE_LOG':
      /* Die Rolling (Rolling the Die) Logic */
      fades = false;
      isWithNav = false;
      setFocus(0);
      break;

    case 'POST_BATTLE':
      /* Die Rolling (Synthesizing the Die) Logic */
      fades = true;
      isWithNav = false;
      setFocus(0);
      break;

    case 'SYNTHESIS_LOG':
      /* Dice Synthesis Logic */
      fades = true;
      isWithNav = true;
      setFocus(0);
      break;
  }

  renderActiveState(isWithNav, fades);
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  var keysUsed = [
    'arrowup',
    'arrowdown',
    'arrowright',
    'arrowleft',
    'w',
    'a',
    's',
    'd',
    ' ',
    'enter',
    'backspace',
    'escape',
    ',', '<',
    '.', '>'
  ];

  if (keysUsed.includes(key)) event.preventDefault();

  var confirmKeys = ['arrowright', 'd', ' ', 'enter'];
  var returnKeys = ['backspace', 'a', 'arrowleft', 'escape'];
  var upKeys = ['w', 'arrowup'];
  var downKeys = ['s', 'arrowdown'];
  var addCardKeys = ['.', '>'];
  var subCardKeys = [',', '<'];

  /* Input Logic */
  if (currentState === 'NAME_INPUT' || currentState === 'MODE_INPUT') {
    if (returnKeys.includes(key) && key !== 'backspace' && key !== 'a') {
      event.preventDefault();
      window.currentName = '';
      window.introSequence = 0;

      setState('PLAYER_SELECT');
      setFocus(0);
      renderActiveState(false, false);
      return;
    }
  }

  if (currentState === 'NAME_INPUT') {
    if (confirmKeys.includes(key) && key !== ' ' && key !== 'd') {
      confirmActiveSelection();
    } else if (window.introSequence === 2) {
      if (key === 'backspace') {
        window.currentName = window.currentName.slice(0, -1);
        renderActiveState(false, false);
      } else if (key.length === 1 && window.currentName.length < 23) {
        window.currentName += event.key;
        renderActiveState(false, false);
      }
    }
    return;
  }

  /* Navigation Logic */
  if (downKeys.includes(key)) {
    let nextFocus = (focusIndex + 1) % totalOptions;
    setFocus(nextFocus);

    renderActiveState(isWithNav, false);

  } else if (upKeys.includes(key)) {
    let prevFocus = (focusIndex - 1 + totalOptions) % totalOptions;
    setFocus(prevFocus);

    renderActiveState(isWithNav, false);

  } else if (confirmKeys.includes(key)) {
    confirmActiveSelection();

  } else if (returnKeys.includes(key)) {
    event.preventDefault();

    import('./modules/stateManager.js').then((mod) => {
      if (inputStates.includes(currentState)) {
        mod.setState('PLAYER_SELECT');
        mod.setFocus(0);
        mod.renderActiveState(false, false);
        return;
      }
      else if (skipStates.includes(currentState)) {
        mod.setState('MAIN_MENU');
        mod.setFocus(0);
        mod.renderActiveState(true, true);
        return;
      }
      
      if (mod.hasHistory()) {
        mod.popHistory();

        switch (currentState) {
          case 'PLAYER_SELECT':
            /* Player Return Logic */
              fades = true;
              isWithNav = false;
            break;

          case 'MAIN_MENU':
            /* Main Menu Return Logic */
              fades = true;
              isWithNav = true;
            break;

          case 'CARDS_MENU':
            /* Card Collection Menu Return Logic */
              fades = true;
              isWithNav = false;
            break;
        }

        mod.setFocus(0);
        mod.renderActiveState(isWithNav, fades);
      }

    });
  }
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('Loading successful!');

  // player_data.push(testProfiles[0]);
  // player_data.push(testProfiles[1]);
  // console.log('Dummy data loaded successfully!');

  initializeCardRegistry();
  console.log('Card registry initialized successfully!');
  
  renderActiveState(false, true);
  console.log('Rendering states...');
});
