import i18next from 'i18next';
import { Environment } from '@ovh-ux/manager-config';

i18next.init({
  resources: {},
  lng: Environment.getLanguage(),
  fallbackLng: 'fr_FR',
});
