import i18next from 'i18next';
import { Environment, LANGUAGES } from '@ovh-ux/manager-config';

const locale = Environment.getUserLocale();

const parseConfig = (t, universe, item) => {
  return {
    apiPath: item.path,
    title: item.title,
    label: t(`${universe}_${item.title}`),
    subitems: item.subitems
      ? item.subitems.map((subitem) => parseConfig(t, universe, subitem))
      : [],
    url: item.url,
    paramName: item.paramName,
    application: item.application,
  };
};

export const getConfig = async (universe) => {
  let config = null;
  let translations = null;
  let fallbackTranslations = null;
  const fallbackLng = LANGUAGES.fallback;

  try {
    translations = (
      await import(`./${universe}/translations/Messages_${locale}.json`)
    ).default;
  } catch (e) {
    translations = {};
  }

  try {
    config = (await import(`./${universe}/${universe}.config.js`)).default;
    fallbackTranslations = (
      await import(`./${universe}/translations/Messages_${fallbackLng}.json`)
    ).default;
  } catch (e) {
    config = [];
    fallbackTranslations = {};
  }

  const t = await i18next.init({
    lng: locale,
    fallbackLng,
    resources: {
      [locale]: {
        translation: translations,
      },
      [fallbackLng]: {
        translation: fallbackTranslations,
      },
    },
  });

  return config.map((item) => parseConfig(t, universe, item));
};

export default {
  getConfig,
};
