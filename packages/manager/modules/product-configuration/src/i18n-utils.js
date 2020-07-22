import i18next from 'i18next';
import { Environment } from '@ovh-ux/manager-config';

const loadTranslations = (namespace) =>
  new Promise((resolve) => {
    if (i18next.hasResourceBundle(Environment.getLanguage(), namespace)) {
      resolve();
    }

    i18next.store.on('added', (lng, ns) => {
      if (ns === namespace) {
        resolve();
      }
    });
  });

export default loadTranslations;
