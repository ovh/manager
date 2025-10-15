import parse from 'date-fns/parse';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import type { Locale } from 'date-fns';

export const fromNow = async (date: string, locale: string): Promise<string> => {
  const importLocale = () => import(`date-fns/locale`);
  const locales = (await importLocale()) as Record<string, Locale> ;
  return formatDistanceStrict(
    parse(date, 'yyyy-MM-dd', new Date()),
    new Date(),
    {
      locale: locales[locale.split('_')[0].toLowerCase()],
      addSuffix: true,
      roundingMethod: 'round',
    },
  );
};

export default { fromNow };
