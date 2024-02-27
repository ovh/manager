import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import getTranslations from './translations';
import { Locale } from '../utils/translation';

const useDynamicTranslation = (namespace: string) => {
  const { t, i18n } = useTranslation(namespace);

  useEffect(() => {
    i18next.init({
      fallbackLng: 'en-GB',
    });
  }, []);

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

export default useDynamicTranslation;
