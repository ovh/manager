import intervalToDuration from 'date-fns/intervalToDuration';
import isDate from 'date-fns/isDate';

interface UseDate {
  fromNow(date: Date | number, locale: string): string;
}

const useDate = (): UseDate => {
  const fromNow = (date: Date | number, locale: string): string => {
    const relativeTimeFormat = new Intl.RelativeTimeFormat(
      locale.replace('_', '-'),
      {
        numeric: 'always',
        style: 'long',
      },
    );

    const fromDate = isDate(date) ? date : new Date(date);

    const durations = intervalToDuration({
      start: fromDate,
      end: new Date(),
    });

    let formatUnit;
    ['years', 'months', 'days', 'hours', 'minutes'].forEach((unit) => {
      if (!formatUnit && durations[unit] > 0) {
        formatUnit = unit;
      }
    });

    return relativeTimeFormat.format(durations[formatUnit] * -1, formatUnit);
  };

  return {
    fromNow,
  };
};

export default useDate;
