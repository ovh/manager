import { useMemo } from 'react';

import { useShellContext } from '@/common/hooks/useShellContext';

type UseDateProps = {
  date: Date;
  options: Intl.DateTimeFormatOptions;
};

export const useFormattedDate = ({ date, options }: UseDateProps): string => {
  const { environment } = useShellContext();
  const { userLocale } = environment;
  return useMemo(() => {
    return Intl.DateTimeFormat(userLocale.replace('_', '-'), options).format(date);
  }, [userLocale, date, options]);
};
