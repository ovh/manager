import { useContext, useMemo } from 'react';

import { User } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type TCurrentUserData = {
  user: User;
  dateTimeFormat: Intl.DateTimeFormat;
};

export const useCurrentUser = () => {
  const { environment } = useContext(ShellContext);

  return useMemo<TCurrentUserData>(() => {
    const user = environment.getUser();
    const dateTimeFormat = new Intl.DateTimeFormat(environment.getUserLocale().replace('_', '-'), {
      dateStyle: 'medium',
    });

    return { user, dateTimeFormat };
  }, [environment]);
};
