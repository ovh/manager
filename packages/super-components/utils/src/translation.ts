export type Language =
  | 'de-DE'
  | 'en-GB'
  | 'es-ES'
  | 'fr-CA'
  | 'fr-FR'
  | 'it-IT'
  | 'pl-PL'
  | 'pt-PT';

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
