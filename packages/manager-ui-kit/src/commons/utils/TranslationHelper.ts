import i18next from 'i18next';
import type { Resource, ResourceLanguage } from 'i18next';

import { locales } from '@/commons/settings/Locales.constants';

/**
 * Manager Fallback Language
 */
const FALLBACK_LANGUAGE = 'fr_FR';

/**
 * Normalizes a language code to a format compatible with i18next loaders.
 * Converts hyphenated codes to underscore format and ensures region codes exist.
 *
 * Examples:
 * - 'fr-FR' → 'fr_FR'
 * - 'en' → 'en_GB'
 * - 'de' → 'de_DE'
 *
 * @param language - The language code from browser or user input.
 * @returns Normalized language code in the format `ll_RR` (e.g., 'en_GB').
 */
export const normalizeLanguageCode = (language: string): string => {
  let normalizedLang = language.replace('-', '_');

  if (!normalizedLang.includes('_')) {
    normalizedLang =
      normalizedLang === 'en' ? 'en_GB' : `${normalizedLang}_${normalizedLang.toUpperCase()}`;
  }

  return normalizedLang;
};

/**
 * Builds a resource loader function for dynamic translation loading.
 *
 * @param translationLoaders - A map of language codes to dynamic import functions for translations.
 * @param namespace - The namespace under which translations will be added.
 */
export const buildTranslationResources =
  (
    translationLoaders: Record<
      string,
      () => Promise<{ default?: Resource; [key: string]: unknown }>
    >,
    namespace: string,
  ) =>
  async (language: string): Promise<boolean> => {
    const normalizedLang = normalizeLanguageCode(language);

    // Always load fallbackLang once, before the user language
    if (!i18next.hasResourceBundle(FALLBACK_LANGUAGE, namespace)) {
      const fallbackLoader = translationLoaders[FALLBACK_LANGUAGE];
      if (fallbackLoader) {
        try {
          console.info(
            `Loading fallback language: ${FALLBACK_LANGUAGE} for namespace: ${namespace}`,
          );
          const fallbackModule = await fallbackLoader();
          const resources = (fallbackModule.default ?? fallbackModule) as Resource;
          i18next.addResources(FALLBACK_LANGUAGE, namespace, resources);
        } catch (error) {
          console.error(`Failed to load fallback translations (${FALLBACK_LANGUAGE}):`, error);
        }
      }
    }

    // Then load the requested language
    if (
      normalizedLang !== FALLBACK_LANGUAGE &&
      !i18next.hasResourceBundle(normalizedLang, namespace)
    ) {
      const loader = translationLoaders[normalizedLang];
      if (loader) {
        try {
          const module = await loader();
          const resources = (module.default ?? module) as Resource;
          i18next.addResources(normalizedLang, namespace, resources);
        } catch (error) {
          console.warn(
            `Could not load ${normalizedLang}. Falling back to ${FALLBACK_LANGUAGE}.`,
            error,
          );
        }
      }
    }

    return true;
  };

/**
 * Initializes and manages i18next language updates and resource loading.
 * Listens to i18next events and browser language changes to update translations dynamically.
 *
 * @param translationLoaders - A map of language codes to dynamic import functions.
 * @param namespace - The namespace to be used for loading translations.
 */
export const buildTranslationManager = (
  translationLoaders: Record<string, () => Promise<{ default?: Resource; [key: string]: unknown }>>,
  namespace: string,
): void => {
  const loadTranslations = buildTranslationResources(translationLoaders, namespace);

  const handleLanguageChange = async (lang: string): Promise<void> => {
    const normalizedLang = normalizeLanguageCode(lang);
    await loadTranslations(normalizedLang);
    console.log('Language changed to:', normalizedLang);
  };

  // Ensure promises are properly handled for event-based hooks
  if (i18next.isInitialized) {
    void handleLanguageChange(i18next.language);
  } else {
    i18next.on('initialized', () => {
      void handleLanguageChange(i18next.language);
    });
  }

  i18next.on('languageChanged', (lang: string) => {
    void handleLanguageChange(lang);
  });
};

/**
 * Union type of supported locale identifiers.
 */
export type LocaleType = (typeof locales)[number];

/**
 * Asynchronous loader that returns an i18next-compatible language resource.
 */
export type TranslationLoaderType = () => Promise<ResourceLanguage>;

/**
 * Creates a resolver function that unwraps a dynamically imported module’s default export.
 *
 * @template T - Type of the resolved module content
 * @returns A function that converts `import('./file.json')` to a typed Promise<T>.
 *
 * @example
 * const resolveTranslationModule = createImportResolver<ResourceLanguage>();
 * const resource = await resolveTranslationModule(import('./Messages_fr_FR.json'));
 */
const createImportResolver =
  <T>() =>
  (p: Promise<{ default: unknown }>) =>
    p.then((m) => m.default as T);

/**
 * A specialized resolver for translation JSON modules,
 * producing i18next {@link ResourceLanguage} objects.
 */
export const resolveTranslationModule = createImportResolver<ResourceLanguage>();

/**
 * Extracts the language code from a locale string.
 * Converts locale format (e.g., 'fr_FR') to language code (e.g., 'fr').
 *
 * @param {string} locale - The locale string in format 'll_RR' or 'll-RR'.
 * @returns {string} - The language code (e.g., 'fr', 'en', 'de').
 *
 * @example
 * extractLanguageCode('fr_FR') // returns 'fr'
 * extractLanguageCode('en_GB') // returns 'en'
 * extractLanguageCode('de-DE') // returns 'de'
 * extractLanguageCode('invalid') // returns 'fr'
 */
export const extractLanguageCode = (locale: string): string => {
  return locale.split(/[-_]/)[0]?.toLowerCase() ?? 'fr';
};
