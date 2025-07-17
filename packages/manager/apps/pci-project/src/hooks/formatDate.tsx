import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';

/**
 * Formats a date with localization support
 * @param date - ISO string date or null
 * @param formatStr - date-fns format (default: 'PPpp')
 * @param language - OVH language format (default: 'fr_FR')
 * @returns Formatted date or null
 */
export const formatDate = (
  date: string | null,
  formatStr = 'PPpp',
  language = 'fr_FR',
): string | null => {
  if (!date) {
    return null;
  }

  const userLocale = getDateFnsLocale(language);
  const locale =
    dateFnsLocales[userLocale as keyof typeof dateFnsLocales] ??
    dateFnsLocales.fr;

  return format(new Date(date), formatStr, {
    locale,
  });
};
