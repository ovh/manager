import i18next from 'i18next';

/**
 * @typedef {Object} TranslationLoaders
 * @property {() => Promise<{default: object}>} de_DE - German (Germany) translations loader
 * @property {() => Promise<{default: object}>} en_GB - English (UK) translations loader
 * @property {() => Promise<{default: object}>} es_ES - Spanish (Spain) translations loader
 * @property {() => Promise<{default: object}>} fr_CA - French (Canada) translations loader
 * @property {() => Promise<{default: object}>} fr_FR - French (France) translations loader
 * @property {() => Promise<{default: object}>} it_IT - Italian (Italy) translations loader
 * @property {() => Promise<{default: object}>} pl_PL - Polish (Poland) translations loader
 * @property {() => Promise<{default: object}>} pt_PT - Portuguese (Portugal) translations loader
 */

/**
 * Object mapping language codes to dynamic import functions for translation files
 * @type {TranslationLoaders}
 */
const translationLoaders = {
  de_DE: () => import('./Messages_de_DE.json'),
  en_GB: () => import('./Messages_en_GB.json'),
  es_ES: () => import('./Messages_es_ES.json'),
  fr_CA: () => import('./Messages_fr_CA.json'),
  fr_FR: () => import('./Messages_fr_FR.json'),
  it_IT: () => import('./Messages_it_IT.json'),
  pl_PL: () => import('./Messages_pl_PL.json'),
  pt_PT: () => import('./Messages_pt_PT.json'),
};

/**
 * Loads translations for the specified language and adds them to i18next
 * @param {keyof TranslationLoaders} lang - The language code to load translations for
 * @returns {Promise<void>}
 */
async function loadTranslations(lang) {
  try {
    const module = await translationLoaders[lang]();
    i18next.addResources(lang, 'region', module.default || module);
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    throw error; // Re-throw if you want calling code to handle failures
  }
}

/**
 * Normalizes browser language code to match i18next format
 * @param {string} browserLang - Raw browser language (e.g., "fr-FR", "en", "en-GB")
 * @returns {keyof TranslationLoaders} Normalized language code
 */
function normalizeLanguageCode(browserLang) {
  // Convert hyphen to underscore (fr-FR → fr_FR)
  let normalizedLang = browserLang.replace('-', '_');

  // Handle shorthand codes (en → en_GB)
  if (!normalizedLang.includes('_')) {
    if (normalizedLang === 'en') {
      normalizedLang = 'en_GB'; // Default to British English
    } else {
      // For other languages without regions (e.g., "de" → de_DE)
      normalizedLang = `${normalizedLang}_${normalizedLang.toUpperCase()}`;
    }
  }

  // Type assertion since we know our loaders cover these cases
  return /** @type {keyof TranslationLoaders} */ normalizedLang;
}

console.log('useTranslatedMicroRegions', {
  i18next,
});

// Initialize i18next then load translations for current language
if (i18next.isInitialized) {
  loadTranslations(i18next.language);
} else {
  i18next.on('initialized', () => {
    loadTranslations(i18next.language);
  });
}

// Listen for language changes from i18next
i18next.on('languageChanged', (lang) => {
  console.log('Storybook Language Changed: ', lang);
  loadTranslations(lang);
});

// Listen for browser language changes
window.addEventListener('languagechange', () => {
  const normalizedLang = normalizeLanguageCode(navigator.language);
  console.log('Browser Language Changed: ', normalizedLang);
  i18next.changeLanguage(normalizedLang);
});
