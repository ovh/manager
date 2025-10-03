import React, { useMemo } from 'react';

import userContext, { User } from '@/context/User/context';

type Props = {
  children: JSX.Element | JSX.Element[];
  readonly user: User;
};

export const UserProvider = ({ children = null, user }: Props): JSX.Element => {
  const memoizedUser = useMemo(() => ({ user }), []);

  return <userContext.Provider value={memoizedUser}>{user && children}</userContext.Provider>;
};

export default UserProvider;
