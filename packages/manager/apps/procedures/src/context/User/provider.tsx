import React, { useCallback, useMemo } from 'react';
import userContext, { User } from '@/context/User/context';
import { ExpiredSessionModal } from '@/context/User/modals/ExpiredSessionModal';
import { WarningSessionModal } from '@/context/User/modals/WarningSessionModal';
import { useSessionModal } from './useSessionModal';
import { getRedirectLoginUrl } from '@/utils/url-builder';

type Props = {
  children: JSX.Element | JSX.Element[];
  readonly user: User;
};

export const UserProvider = ({ children = null, user }: Props): JSX.Element => {
  const memoizedUser = useMemo(() => ({ user }), []);

  return (
    <userContext.Provider value={memoizedUser}>
      {user && children}
    </userContext.Provider>
  );
};

export default UserProvider;
