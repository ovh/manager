import { User } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';

type TCurrentUserData = {
  user: User;
  dateTimeFormat: Intl.DateTimeFormat;
};

const useCurrentUser = () => {
  const { environment } = useContext(ShellContext);

  const [currentUserData, setCurrentUserData] = useState<TCurrentUserData>({
    user: null,
    dateTimeFormat: null,
  });

  useEffect(() => {
    const user = environment.getUser();
    const dateTimeFormat = new Intl.DateTimeFormat(
      environment.getUserLocale().replace('_', '-'),
      {
        dateStyle: 'medium',
      },
    );
    setCurrentUserData({ user, dateTimeFormat });
  }, [environment]);

  return currentUserData;
};

export default useCurrentUser;
