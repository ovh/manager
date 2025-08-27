import i18next from 'i18next';

import fr_FR from './Messages_fr_FR.json';

function addTranslations() {
  i18next.addResources('fr_FR', 'error', fr_FR);
}

if (i18next.isInitialized) {
  addTranslations();
} else {
  i18next.on('initialized', addTranslations);
}
