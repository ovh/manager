/**
 * Change the language from OVH Locale to i18next format
 */
export function ovhLocaleToI18next(language?: string) {
  return language?.replace('-', '_') ?? '';
}

/**
 * Get translations with variables
 */
export function translate<T extends Record<string, string>>(
  localeStrings: T,
  key: keyof T,
  options?: Record<string, string>,
): string {
  const baseTranslation = localeStrings[key] ?? '';
  return !options
    ? baseTranslation
    : Object.entries(options).reduce(
        (translation, [optionPlaceholder, optionValue]) =>
          translation.replace(
            new RegExp(`{{\\s*${optionPlaceholder}\\s*}}`, 'g'),
            optionValue,
          ),
        baseTranslation,
      );
}

/**
 * Fetch the translation files for a super component
 */
export async function fetchTranslation<T = Record<string, string>>(
  language: string,
): Promise<T> {
  const result = await fetch(
    `translations/Messages_${ovhLocaleToI18next(language)}.json`,
  );
  if (!result.ok) {
    throw new Error(
      `No translations found for language ${ovhLocaleToI18next(language)}`,
    );
  }
  return result.json();
}
