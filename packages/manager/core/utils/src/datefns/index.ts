/**
 * Converts an ovh locale to date-fns locale.
 * Examples:
 *   getDateFnsLocale('fr_FR') => 'fr'
 *   getDateFnsLocale('fr_CA') => 'frCA'
 */
export function getDateFnsLocale(ovhLocale: string) {
  if (ovhLocale === 'en_GB') {
    return 'enGB';
  }
  if (ovhLocale === 'fr_CA') {
    return 'frCA';
  }
  const [locale] = ovhLocale?.split('_');
  return locale || 'enGB';
}
