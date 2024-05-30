import React, { useMemo } from 'react';
import userContext, { User } from '@/context/User/context';

type Props = {
  children: JSX.Element | JSX.Element[];
  readonly user: User;
};

export const UserProvider = ({ children = null, user }: Props): JSX.Element => {
  // If we don't have a user or the "session" is expired we redirect the user on the login page
  if (!user || user.exp * 1000 < Date.now()) {
    const loginUrl =
      window.location.host === 'www.ovhtelecom.fr'
        ? 'https://www.ovh.com/auth/'
        : '/auth';

    const subsidiaryParams = user?.subsidiary
      ? `?ovhSubsidiary=${user.subsidiary}`
      : '';

    window.location.assign(`${loginUrl}${subsidiaryParams}`);
  }
  const memoizedUser = useMemo(() => user, []);

  return (
    <userContext.Provider value={{ user: memoizedUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
