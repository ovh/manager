import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useMemo } from 'react';

type UseDateProps = {
  date: Date;
  options: Intl.DateTimeFormatOptions;
};

export const useFormattedDate = ({ date, options }: UseDateProps): string => {
  const {
    environment: { userLocale },
  } = useContext(ShellContext);

  return useMemo(() => {
    return Intl.DateTimeFormat(userLocale.replace('_', '-'), options).format(
      date,
    );
  }, [userLocale, date]);
};
