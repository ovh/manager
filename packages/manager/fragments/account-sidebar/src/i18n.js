import { createI18n } from 'vue-i18n';
import { LANGUAGES } from '@ovh-ux/manager-config';

/* eslint-disable no-param-reassign */
export function setI18nLanguage(i18n, locale) {
  i18n.locale = locale;
}

export function setupI18n(newLocale) {
  const locale = newLocale;
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
export async function loadLocaleMessages(locale, oldMessages, folderNames = []) {
  const translationsFolder = 'translations';
  let messages = { ...oldMessages };

  const setMessages = async () => {
    await loadMessagesFromPaths(folderNames, async (folderName) => {
      const newMessages =
        folderName === '/'
          ? await import(`./${translationsFolder}/Messages_${locale}.json`)
          : await import(`./${translationsFolder}/${folderName}/Messages_${locale}.json`);

      messages = { ...messages, ...newMessages.default };
    });
  };

  await setMessages();
  return messages;
}
