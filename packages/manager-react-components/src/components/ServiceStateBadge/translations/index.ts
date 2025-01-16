import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import i18next from 'i18next';
import service_fr_FR from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/service/Messages_fr_FR.json';

function addTranslations() {
  i18next.addResources('fr_FR', NAMESPACES.SERVICE, service_fr_FR);
}

if (i18next.isInitialized) {
  addTranslations();
} else {
  i18next.on('initialized', addTranslations);
}
