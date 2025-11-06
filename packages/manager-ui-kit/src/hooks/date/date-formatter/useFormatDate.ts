import { useCallback } from 'react';

import { format as formatDateFns, isValid } from 'date-fns';

import { useDateFnsLocale } from '@/hooks/date/date-fns-locale/useDateFnsLocale';
import {
  DEFAULT_UNKNOWN_DATE_LABEL,
  FormatDateOptions,
} from '@/hooks/date/date-formatter/FormatDate.type';

export const useFormatDate = ({
  invalidDateDisplayLabel = DEFAULT_UNKNOWN_DATE_LABEL,
}: { invalidDateDisplayLabel?: string } = {}) => {
  const locale = useDateFnsLocale();

  return useCallback(
    ({ date, format = 'PP' }: FormatDateOptions): string => {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;

      if (!parsedDate || !isValid(parsedDate)) {
        return invalidDateDisplayLabel;
      }

      try {
        return formatDateFns(parsedDate, format, { locale });
      } catch {
        return invalidDateDisplayLabel;
      }
    },
    [locale, invalidDateDisplayLabel],
  );
};
