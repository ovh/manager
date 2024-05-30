import React from 'react';
import userContext, { User } from '@/components/User/context';

type Props = {
  children: JSX.Element | JSX.Element[];
  user: User;
};

export const UserProvider = ({ children = null, user }: Props): JSX.Element => {
  // If we don't have a user or the "session" is expired we redirect the user on the login page
  if (!user || user.exp * 1000 < Date.now()) {
    let loginUrl =
      window.location.host === 'www.ovhtelecom.fr'
        ? 'https://www.ovh.com/auth/'
        : '/auth';

    if (user?.subsidiary) {
      loginUrl += `?ovhSubsidiary=${user.subsidiary}`;
    }

    window.location.assign(loginUrl);
  }

  return (
    <userContext.Provider value={{ user }}>{children}</userContext.Provider>
  );
};

export default UserProvider;
