import { nextTick } from 'vue';

/* eslint-disable no-param-reassign */
export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }

  document.querySelector('html').setAttribute('lang', locale);
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
    i18n.global.setLocaleMessage(locale, messages);
  };

  setMessages();
  return nextTick();
}
