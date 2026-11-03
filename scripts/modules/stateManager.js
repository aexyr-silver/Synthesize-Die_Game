import {
  // testProfiles,
  player_data,
  activeProfile
} from './profileManager.js';

import {
  card_registry,
  card_data
} from './cardsManager.js';

export let focusIndex = 0;
export let totalOptions = 0;

// States: 'PLAYER_SELECT' (1), 'NAME_INPUT' (1A), 'MODE_INPUT' (1A),
//         'MAIN_MENU' (2),
//         'CARDS_MENU' (3),
//         'PRE_MATCH' (4), 'BATTLE_LOG' (5), 'POST_BATTLE' (6),
//         'SYNTHESIS_LOG' (7)

export let currentState = 'PLAYER_SELECT';

const stateHistory = [];
export const skipStates = ['PRE_MATCH', 'BATTLE_LOG', 'POST_BATTLE'];
export const inputStates = ['NAME_INPUT', 'MODE_INPUT'];
export const GAME_MODES = [
  {
    name: 'Dull',
    limits: [2, 4, 6, 8, 10, 12, 20],
  },
  {
    name: 'Fiery',
    limits: [6, 6, 6],
  },
  {
    name: 'Cursed',
    limits: [4, 6, 6, 6, 13],
  },
];

/* Set Functions for Data Modification */
export function setState(state) {
  if (currentState !== state) {
    if (!skipStates.includes(state) || !inputStates.includes(state)) stateHistory.push(currentState);
  }
  currentState = state;

  if (currentState === 'PLAYER_SELECT') {
    stateHistory.length = 0;
    stateHistory.push('PLAYER_SELECT');
  }
}
export function popHistory() {
  if (stateHistory.length > 0) currentState = stateHistory.pop();
  else clearHistory();

  if (currentState === 'PLAYER_SELECT') clearHistory();

  return currentState;
}
export function clearHistory() {
  while (stateHistory.length > 0) stateHistory.pop();
  currentState = 'PLAYER_SELECT';
  stateHistory = [];
}
export function hasHistory() {
  return stateHistory.length > 0;
}
export function setFocus(index) {
  focusIndex = index;
}

export function renderActiveState(withNav = true, fades = false) {
  const mainSpace = document.getElementById('main-space');
  if (!mainSpace) return;

  const navBar = document.querySelector('nav');
  if (navBar) {
    if (withNav) navBar.classList.remove('hide-element');
    else navBar.classList.add('hide-element');
  }

  mainSpace.classList.remove('fade-out');
  if (fades) {
    mainSpace.classList.add('fade-out');
  }

  setTimeout(
    () => {
      mainSpace.innerHTML = '';
      let codeBase = '';
      let isFocus = false;
      let classes = `class="`;

      const cachedName = window.currentName || '';
      const sequence = window.introSequence || 0;

      switch (currentState) {
        case 'PLAYER_SELECT':
          totalOptions = player_data.length + 1;
          codeBase = `<div class="menu">`;

          player_data.forEach((p, id) => {
            if (id === focusIndex) {
              isFocus = true;
              classes += 'focus';
            }

            codeBase += `<div ${classes}">${p.name} [${p.currentTier}] with ${p.currentGameMode} rules.`;

            if (isFocus)
              codeBase += `<span class="focus-cursor cursor-blink"> >></span>`;

            codeBase += `</div>`;
            isFocus = false;
            classes = `class="`;
          });

          var isCreate = false;
          if (focusIndex === player_data.length) {
            isCreate = true;
            classes += 'focus';
          }

          codeBase += `<div ${classes}">[ Create a New Profile ]`;

          if (isCreate)
            codeBase += `<span class="focus-cursor cursor-blink"> >></span>`;

          codeBase += `</div></div>`;
          break;

        case 'NAME_INPUT':
          totalOptions = 1;

          codeBase = `
          <div class="cutscene-container">
            <p class="cutscene-text ${
              sequence === 0 ? 'active-step' : 'past-step'
            }">
              As you awoke,
            </p>
            
            <p class="cutscene-text ${
              sequence === 1
                ? 'active-step'
                : sequence > 1
                ? 'past-step'
                : 'hidden-step'
            }">
              You try to recall.
            </p>

            <div class="interactive-prompt-block ${
              sequence >= 2 ? 'fade-in-prompt' : 'hidden-prompt'
            }">
              <div class="focus-input-box">
                ${cachedName}<span class="cursor-blink">_</span>
              </div>
              <p class="helper-text">Type the name you recall.</p>
            </div>
          </div>
        `;
          break;

        case 'MODE_INPUT':
          totalOptions = GAME_MODES.length;

          codeBase = `
          <div class="cutscene-container">
            <p class="cutscene-text past-step">As you awoke,</p>
            <p class="cutscene-text past-step">You try to recall.</p>
            <p class="cutscene-text past-step-name">Your name is "${cachedName}".</p>
            
            <div class="interactive-prompt-block fade-in-prompt" style="width: 100%; max-width: 500px;">
              <p>You find the space around you...</p>
              <div class="menu">
        `;

          GAME_MODES.forEach((mode, id) => {
            if (id === focusIndex) {
              isFocus = true;
              classes += `focus`;
            }

            codeBase += `<div ${classes}">${mode.name}`;

            if (isFocus)
              codeBase += `<span class="focus-cursor cursor-blink"> >></span>`;

            codeBase += `<br/>
          <div class="helper-text">
            [ ${mode.limits} ]
          </div>
          </div>`;

            isFocus = false;
            classes = `class="`;
          });

          codeBase += `</div> </div> </div>`;
          break;

        case 'MAIN_MENU':
          totalOptions = 5;
          const optionsText = [
            'Discover Dices',
            'Side Card Collection',
            'Select a Different Profile',
            'Remove This Profile',
            'Quit',
          ];

          codeBase = `<div class="main-menu">
            <h3 style="margin-bottom: 0rem; font-size: 1.8rem;">Welcome back, ${activeProfile.name}</h3>
            <p style="padding-top: 0rem;" class = "helper-text">${activeProfile.points} point(s) | [ Tier ${activeProfile.currentTier} ] | ${activeProfile.currentGameMode}  Rules</p><br/>
            <div class="menu" style="margin-top: 0.5rem;">`;

          optionsText.forEach((option, id) => {
            var isFocus = false;
            var classes = `class="`;

            if (id === focusIndex) {
              isFocus = true;
              classes += `focus`;
            }

            codeBase += `<div ${classes}">[  <b>${option}</b>  ]`;

            if (isFocus) codeBase += '<span class="focus-cursor cursor-blink"> >></span>';

            codeBase += '</div>';
            isFocus = false;
            classes = `class="`;
          });

          codeBase += '</div>';
          break;

        case 'CARDS_MENU':
          const card_data_IDs = Object.keys(card_data);
          totalOptions = card_data_IDs.length + 1;

          let focusCard = card_data_IDs[focusIndex];
          const isFocusUnlocked = activeProfile && activeProfile.cardsUnlocked.includes(focusCard);

          if (isFocusUnlocked) focusCard = card_data[focusCard];
          else focusCard = null;

          codeBase = `
            <div class="cards-screen-container">
              <div class="cards-list-column">
                <h3>Side Card Collection</h3>
                <p class="helper-text" style="margin-bottom:1.8rem;">Your collection of side cards. You can only use unlocked cards as sides to your die.</p>
              
                <div class="cards-list">
          `;

          card_data_IDs.forEach((key, id) => {
            const isUnlocked = activeProfile && activeProfile.cardsUnlocked.includes(key);
            var cardName = '???';
            var cardStatus = `card-locked`;

            if (isUnlocked) {
              cardName = card_data[key].name;
              cardStatus = `card-unlocked`;
            }

            isFocus = (id === focusIndex);
            classes = '';

            if (isFocus) classes = 'focus';

            codeBase += `
              <div class="card-list-item ${cardStatus} ${classes}">
                <div class="card-title"><h3>${cardName}
            `;

            if (isFocus) codeBase += `<span class="focus-cursor cursor-blink">_ </span>`;

            codeBase += `</h3></div>
            <div class="helper-text">ID: ${key.toUpperCase()}</div>
            </div>`;
          });

          isFocus = (focusIndex === card_data_IDs.length);
          classes = '';

          if (isFocus) classes = 'focus';

          codeBase += `
            </div>
            <div class="menu ${classes}" style="text-align: center; padding-top: 2.5rem;">
              [  Back to Main Menu  ] ${isFocus ? '<span class="focus-cursor cursor-blink"> >></span>' : ''}
            </div> </div>

            <div class="card-inspect-column">
              <div class="inspect-panel">
          `;

          if (focusCard) {
            codeBase += `
              <h2 style="color: aqua; margin: 0 0 0.5rem 0;">${focusCard.name}</h2>
              <div class="inspect-badge">${focusCard.rarity} - ${focusCard.type}</div>
              <hr class="inspect-divider">
              <p class="inspect-description">
                ${focusCard.description}
              </p>
            `;
          }
          else {
            codeBase += `
              <h2 style="color: aqua; margin: 0 0 0.5rem 0;">???</h2>
              <div class="inspect-badge">Unrecognized - Unknown</div>
              <hr class="inspect-divider">
              <p class="inspect-description">
                [!] ERROR: Synthesis incomplete.<br/><br/>
                Collect this card by scanning it while discovering the possibilities.
              </p>
            `;
          }
          break;

        case 'PRE_MATCH':
          
          break;  
      }

      mainSpace.innerHTML = codeBase;
      requestAnimationFrame(() => {
        mainSpace.classList.remove('fade-out');

        const activeElement = mainSpace.querySelector('.focus');
        if (activeElement) activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      });
    },
    fades ? 250 : 0 /* in millisecond, according to CSS */
  );
}
