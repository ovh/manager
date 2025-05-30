import i18next from 'i18next';

/**
 * Normalizes a language code to a format compatible with i18next loaders.
 * Converts hyphenated codes to underscore format and ensures region codes exist.
 *
 * Examples:
 * - 'fr-FR' → 'fr_FR'
 * - 'en' → 'en_GB'
 * - 'de' → 'de_DE'
 *
 * @param {string} language - The language code from browser or user input.
 * @returns {string} - Normalized language code in the format `ll_RR` (e.g., 'en_GB').
 */
export const normalizeLanguageCode = (language) => {
  let normalizedLang = language.replace('-', '_');

  if (!normalizedLang.includes('_')) {
    if (normalizedLang === 'en') {
      normalizedLang = 'en_GB';
    } else {
      normalizedLang = `${normalizedLang}_${normalizedLang.toUpperCase()}`;
    }
  }

  return normalizedLang;
};

/**
 * Builds a resource loader function for dynamic translation loading.
 * This function is partially applied with a `translationLoaders` map and a namespace.
 * @param translationLoaders - A map of language codes to dynamic import functions for translations.
 * @param namespace - The namespace under which translations will be added.
 */
export const buildTranslationResources =
  (translationLoaders, namespace) => async (language) => {
    try {
      const normalizedLang = normalizeLanguageCode(language);
      const module = await translationLoaders[normalizedLang]();
      i18next.addResources(normalizedLang, namespace, module.default || module);
      return true;
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
      return false;
    }
  };

/**
 * Initializes and manages i18next language updates and resource loading.
 * Listens to i18next events and browser language changes to update translations dynamically.
 *
 * @param {Record<string, () => Promise<any>>} translationLoaders -
 *   A map of language codes to dynamic import functions.
 * @param {string} namespace - The namespace to be used for loading translations.
 */
export const buildTranslationManager = (translationLoaders, namespace) => {
  const loadTranslations = buildTranslationResources(
    translationLoaders,
    namespace,
  );

  const handleLanguageChange = async (lang) => {
    const normalizedLang = normalizeLanguageCode(lang);
    await loadTranslations(normalizedLang);
    console.log('Language changed to:', normalizedLang);
  };

  if (i18next.isInitialized) {
    handleLanguageChange(i18next.language);
  } else {
    i18next.on('initialized', () => {
      handleLanguageChange(i18next.language);
    });
  }

  i18next.on('languageChanged', handleLanguageChange);
};
