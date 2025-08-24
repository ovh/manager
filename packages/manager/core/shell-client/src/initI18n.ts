import i18n from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { ShellContextType } from './ShellContext';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

export const ovhLocaleToI18next = (ovhLocale = '') => ovhLocale.replace('_', '-');

export const i18nextLocaleToOvh = (i18nextLocale = '') => i18nextLocale.replace('-', '_');

export const initI18n = async ({
  context,
  reloadOnLocaleChange,
  defaultNS,
  ns,
}: {
  context: ShellContextType;
  reloadOnLocaleChange?: boolean;
  defaultNS: string;
  ns: string[];
}) => {
  const locale = context.environment.getUserLocale() || defaultLocale;
  const localeList = await context.shell.i18n.getAvailableLocales();
  const availableLocales =
    localeList.map(({ key }: { name: string; key: string }) => key) || defaultAvailableLocales;

  i18n
    .use(initReactI18next)
    .use(I18NextHttpBackend)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) => (value ? value.replace(/&amp;/g, '&') : value),
    })
    .init({
      lng: locale,
      fallbackLng: defaultLocale,
      defaultNS,
      ns,
      supportedLngs: availableLocales,
      postProcess: 'normalize',
      interpolation: {
        escapeValue: false,
      },
      backend: {
        allowMultiLoading: false,
        loadPath: (lngs: string[], namespaces: string[]) =>
          `${import.meta.env.BASE_URL}translations/${namespaces[0]}/Messages_${lngs[0]}.json`,
      },
    });

  context.shell.i18n.onLocaleChange(({ locale: currentLocale }: { locale: string }) => {
    if (reloadOnLocaleChange) {
      window.top?.location.reload();
    } else {
      i18n.changeLanguage(currentLocale);
    }
  });

  return i18n;
};
