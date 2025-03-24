import i18next from 'i18next';

// import de_DE from './Messages_de_DE.json';
// import en_GB from './Messages_en_GB.json';
// import es_ES from './Messages_es_ES.json';
// import fr_CA from './Messages_fr_CA.json';
import fr_FR from './Messages_fr_FR.json';
// import it_IT from './Messages_it_IT.json';
// import pl_PL from './Messages_pl_PL.json';
// import pt_PT from './Messages_pt_PT.json';

function addTranslations() {
  // i18next.addResources('de_DE', 'billing-informations-tile', de_DE);
  // i18next.addResources('en_GB', 'billing-informations-tile', en_GB);
  // i18next.addResources('es_ES', 'billing-informations-tile', es_ES);
  // i18next.addResources('fr_CA', 'billing-informations-tile', fr_CA);
  i18next.addResources('fr_FR', 'billing-informations-tile', fr_FR);
  // i18next.addResources('it_IT', 'billing-informations-tile', it_IT);
  // i18next.addResources('pl_PL', 'billing-informations-tile', pl_PL);
  // i18next.addResources('pt_PT', 'billing-informations-tile', pt_PT);
}

if (i18next.isInitialized) {
  addTranslations();
} else {
  i18next.on('initialized', addTranslations);
}
