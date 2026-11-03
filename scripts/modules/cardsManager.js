
export let default_cards = {
  "void_01": {
      "name": "Void Card",    /* Removes 1 Point and Awards 1 Point to Self */
      "description": "The void awakens and provides. Do what you must to make it.",
      "type": "Void",
      "rarity": "Base",
      "effect": {
          // Basic Effects
          "remove": 1,        /* Remove 1 Point from Self */
          "award": 1,         /* Add 1 Point to Self */
          "multiply": 1,      /* Multiply Self Point by 1 */
          "opp_remove": 0,    /* Remove 0 Point from Opponent */
          "opp_award": 0,     /* Add 0 Point to Opponent */
          "opp_multiply": 1,  /* Multiply Opponent Point by 1 */

          // AND Ruling Effects
          "enable_award": true,       /* Enables awarding Point to Self */
          "enable_remove": true,      /* Enables removing Point from Self */
          "opp_enable_award": true,   /* Enables awarding Point to Opponent */
          "opp_enable_remove": true   /* Enables removing Point from Opponent */
      }
  },
  "void_02": {
      "name": "Alchemy Card", /* Removes 1 Point from Opponent, Awards it to Self */
      "description": "Take and give, to whom it may be. The Alchemist thrives.",
      "type": "Void",
      "rarity": "Common",
      "effect": {
          // Basic Effects
          "remove": 0,        /* Remove 0 Point from Self */
          "award": 1,         /* Add 1 Point to Self */
          "multiply": 1,      /* Multiply Self Point by 1 */
          "opp_remove": 1,    /* Remove 1 Point from Opponent */
          "opp_award": 0,     /* Add 0 Point to Opponent */
          "opp_multiply": 1,  /* Multiply Opponent Point by 1 */

          // AND Ruling Effects
          "enable_award": true,       /* Enables awarding Point to Self */
          "enable_remove": true,      /* Enables removing Point from Self */
          "opp_enable_award": true,   /* Enables awarding Point to Opponent */
          "opp_enable_remove": true   /* Enables removing Point from Opponent */
      }
  },
  "ember_01": {
      "name": "Burn Card",    /* Removes 1 Point from Opponent and Self */
      "description": "Embers flicker in the dark. Was it worth it?",
      "type": "Ember",
      "rarity": "Common",
      "effect": {
          // Basic Effects 
          "remove": 1,        /* Remove 1 Point from Self */
          "award": 0,         /* Add 0 Point to Self */
          "multiply": 1,      /* Multiply Self Point by 1 */
          "opp_remove": 1,    /* Remove 1 Point from Opponent */
          "opp_award": 0,     /* Add 0 Point to Opponent */
          "opp_multiply": 1,  /* Multiply Opponent Point by 1 */

          // AND Ruling Effects
          "enable_award": true,       /* Enables awarding Point to Self */
          "enable_remove": true,      /* Enables removing Point from Self */
          "opp_enable_award": true,   /* Enables awarding Point to Opponent */
          "opp_enable_remove": true   /* Enables removing Point from Opponent */
      }
  },
  "ember_02": {
      "name": "Smithing Card", /* Disables point removal from Opponent and Self */
      "description": "The Blacksmith has always forged for one purpose. Peace.",
      "type": "Ember",
      "rarity": "Rare",
      "effect": {
          // Basic Effects
          "remove": 0,        /* Remove 0 Point from Self */
          "award": 0,         /* Add 0 Point to Self */
          "multiply": 1,      /* Multiply Self Point by 1 */
          "opp_remove": 0,    /* Remove 0 Point from Opponent */
          "opp_award": 0,     /* Add 0 Point to Opponent */
          "opp_multiply": 1,  /* Multiply Opponent Point by 1 */

          // AND Ruling Effects
          "enable_award": true,       /* Enables awarding Point to Self */
          "enable_remove": false,     /* Disables removing Point from Self */
          "opp_enable_award": true,   /* Enables awarding Point to Opponent */
          "opp_enable_remove": false  /* Disables removing Point from Opponent */
      }
  },
  "frost_01": {
      "name": "Crystalize Card",  /* Awards 2 points to self */
      "description": "The crystallization of your efforts. Reward yourself.",
      "type": "Frost",
      "rarity": "Common",
      "effect": {
          // Basic Effects
          "remove": 0,        /* Remove 0 Point from Self */
          "award": 2,         /* Add 2 Point to Self */
          "multiply": 1,      /* Multiply Self Point by 1 */
          "opp_remove": 0,    /* Remove 0 Point from Opponent */
          "opp_award": 0,     /* Add 0 Point to Opponent */
          "opp_multiply": 1,  /* Multiply Opponent Point by 1 */

          // AND Ruling Effects
          "enable_award": true,       /* Enables awarding Point to Self */
          "enable_remove": true,      /* Disables removing Point from Self */
          "opp_enable_award": true,   /* Enables awarding Point to Opponent */
          "opp_enable_remove": true   /* Disables removing Point from Opponent */
      }
  },
  "frost_02": {
      "name": "Frostbite Card",   /* Multiplies Self and Opponent */
      "description": "When the chill surpasses what was once. Who made it out?",
      "type": "Frost",
      "rarity": "Rare",
      "effect": {
          // Basic Effects
          "remove": 0,        /* Remove 0 Point from Self */
          "award": 1,         /* Add 0 Point to Self */
          "multiply": 2,      /* Multiply Self Point by 2 */
          "opp_remove": 1,    /* Remove 0 Point from Opponent */
          "opp_award": 0,     /* Add 0 Point to Opponent */
          "opp_multiply": 2,  /* Multiply Opponent Point by 2 */

          // AND Ruling Effects
          "enable_award": true,       /* Enables awarding Point to Self */
          "enable_remove": true,      /* Disables removing Point from Self */
          "opp_enable_award": true,   /* Enables awarding Point to Opponent */
          "opp_enable_remove": true   /* Disables removing Point from Opponent */
      }
  }
};

const storedCards = localStorage.getItem('card_data_index');
export let card_data = storedCards ? JSON.parse(storedCards) : default_cards;

export let card_registry = [];

function pushName(key, n) {
  while (n > 0) {
    card_registry.push(key);
    n -= 1;
  }
}
export function initializeCardRegistry() {
  card_registry = [];

  Object.keys(card_data).forEach((id) => {
    switch (card_data[id].rarity) {
      case 'Lost': pushName(id, 1); break;
      case 'Mythic': pushName(id, 2); break;
      case 'Fabled': pushName(id, 5); break;
      case 'Historic': pushName(id, 8); break;
      case 'Rare': pushName(id, 10); break;
      case 'Common': pushName(id, 20); break;
      case 'Base': pushName(id, 50); break;
      default: console.log(`Cannot specify the rarity of ${card_data[id].name}.\nSkipping card...`); break;
    }
  });
}
export function saveToCardData() {
  localStorage.setItem('card_data_index', JSON.stringify(card_data));
}

import {
  GAME_MODES
} from './stateManager.js';

export let activeSlots_p = [];
export let activeSlots_o = [];

export function initializeSlots(tierSize, gameMode) {
  const totalSlots = GAME_MODES["gameMode"][tierSize];
}