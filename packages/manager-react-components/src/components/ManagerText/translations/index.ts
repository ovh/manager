import i18next from 'i18next';

import fr_FR from './Messages_fr_FR.json';
import en_GB from './Messages_en_GB.json';

function addTranslations() {
  i18next.addResources('fr_FR', 'iam', fr_FR);
  i18next.addResources('en_GB', 'iam', en_GB);
}

if (i18next.isInitialized) {
  addTranslations();
} else {
  i18next.on('initialized', addTranslations);
}
