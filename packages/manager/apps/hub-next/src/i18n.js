import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import { Environment, LANGUAGES } from '@ovh-ux/manager-config';
import axios from 'axios';

/* eslint-disable no-param-reassign */
export function setI18nLanguage(i18n, locale) {
  i18n.global.locale = locale;

  axios.defaults.headers.common['Content-Language'] = locale;
  document.querySelector('html').setAttribute('lang', locale);
}

export function setupI18n() {
  const locale = Environment.getUserLocale();
  const fallbackLocale = LANGUAGES.fallback;
  const datetimeFormats = {
    [locale.replace('_', '-')]: {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      shortNumeric: { year: 'numeric', month: 'numeric', day: 'numeric' },
    },
  };

  const i18n = createI18n({
    locale,
    fallbackLocale,
    datetimeFormats,
  });

  setI18nLanguage(i18n, locale);

  return i18n;
}


async function loadMessagesFromPaths(arrayPaths, callback) {
  for (let index = 0; index < arrayPaths.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(arrayPaths[index], index, arrayPaths);
  }
}

/**
 *
 * @param {*} i18n
 * @param {Array<string>} folderNames : Array of names/paths of folders to load locales from
 * @param {*} locale
 */
export async function loadLocaleMessages(i18n, locale, folderNames = []) {
  const translationsFolder = 'translations';

  let messages = await import(`./${translationsFolder}/Messages_${locale}.json`);

  const setMessages = async () => {
    await loadMessagesFromPaths(folderNames, async (folderName) => {
      const newMessages = await import(`./${translationsFolder}/${folderName}/Messages_${locale}.json`);
      messages = { ...messages, ...newMessages };
    });

    // set locale and locale message
    try {
      i18n.global.setLocaleMessage(locale, messages);
    } catch {
      i18n.setLocaleMessage(locale, messages);
    }
  };

  setMessages();
  return nextTick();
}
