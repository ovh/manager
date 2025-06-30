import i18next from 'i18next';

/**
 * Manager Fallback Language
 */
const fallbackLang = 'fr_FR';

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
export const normalizeLanguageCode = (language: string) => {
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
export const buildTranslationResources = (
  translationLoaders: Record<string, () => Promise<any>>,
  namespace: string,
) => async (language: string) => {
  const normalizedLang = normalizeLanguageCode(language);

  // Always load fallbackLang once, before the user language
  if (!i18next.hasResourceBundle(fallbackLang, namespace)) {
    try {
      console.info(
        `Loading fallback language: ${fallbackLang} for namespace: ${namespace}`,
      );
      const fallbackModule = await translationLoaders[fallbackLang]();
      i18next.addResources(
        fallbackLang,
        namespace,
        fallbackModule.default || fallbackModule,
      );
    } catch (error) {
      console.error(
        `Failed to load fallback translations (${fallbackLang}):`,
        error,
      );
    }
  }

  // Then load the requested language
  if (
    normalizedLang !== fallbackLang &&
    !i18next.hasResourceBundle(normalizedLang, namespace)
  ) {
    try {
      const module = await translationLoaders[normalizedLang]();
      i18next.addResources(normalizedLang, namespace, module.default || module);
    } catch (error) {
      console.warn(
        `Could not load ${normalizedLang}. Will fallback to ${fallbackLang}.`,
        error,
      );
    }
  }

  return true;
};

/**
 * Initializes and manages i18next language updates and resource loading.
 * Listens to i18next events and browser language changes to update translations dynamically.
 *
 * @param {Record<string, () => Promise<any>>} translationLoaders -
 *   A map of language codes to dynamic import functions.
 * @param {string} namespace - The namespace to be used for loading translations.
 */
export const buildTranslationManager = (
  translationLoaders: Record<string, () => Promise<any>>,
  namespace: string,
) => {
  const loadTranslations = buildTranslationResources(
    translationLoaders,
    namespace,
  );

  const handleLanguageChange = async (lang: string) => {
    const normalizedLang = normalizeLanguageCode(lang);
    await loadTranslations(normalizedLang);
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
