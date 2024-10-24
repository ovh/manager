import { useMemo } from 'react';
import { useLocale } from '@/hooks/useLocale.hook';

interface TableDateCellProps {
  date: Date;
  options?: Intl.DateTimeFormatOptions;
}

const FormattedDate = ({ date, options }: TableDateCellProps) => {
  const locale = useLocale();
  const formater = useMemo(
    () => new Intl.DateTimeFormat(locale.replace('_', '-'), options),
    [locale],
  );
  return formater.format(date);
};
export default FormattedDate;
