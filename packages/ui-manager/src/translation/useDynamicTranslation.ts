import { useEffect } from 'react';
import getTranslations from './translations';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Locale } from '@ovhcloud/msc-utils';

export const useDynamicTranslation = (namespace: string) => {
  const { t, i18n } = useTranslation(namespace);

  useEffect(() => {
    const loadTrad = async () => {
      const loadedTranslation = await getTranslations({
        locale: i18n.language as Locale,
        componentName: namespace,
      });
      i18next.addResourceBundle(i18n.language, namespace, loadedTranslation);
      i18n.changeLanguage(i18n.language);
    };
    loadTrad();
  }, [i18n.language]);

  return { t };
};
