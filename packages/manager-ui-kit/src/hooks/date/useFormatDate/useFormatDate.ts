import { useCallback } from 'react';
import { format as formatDateFns, isValid } from 'date-fns';
import { useDateFnsLocale } from '../useDateFnsLocale';
import {
  FormatDateOptions,
  DEFAULT_UNKNOWN_DATE_LABEL,
} from './useFormatDate.type';

export const useFormatDate = ({
  invalidDateDisplayLabel = DEFAULT_UNKNOWN_DATE_LABEL,
}: { invalidDateDisplayLabel?: string } = {}) => {
  const locale = useDateFnsLocale();

  const formatDate = useCallback(
    ({ date, format = 'PP' }: FormatDateOptions): string => {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;

      if (!parsedDate || !isValid(parsedDate)) {
        return invalidDateDisplayLabel;
      }

      try {
        return formatDateFns(parsedDate, format, { locale });
      } catch (_e) {
        return invalidDateDisplayLabel;
      }
    },
    [locale, invalidDateDisplayLabel],
  );

  return formatDate;
};
