import React, { useCallback, useEffect, useMemo, useState } from 'react';
import userContext, { User } from '@/context/User/context';
import { ExpiredSessionModal } from './modals/ExpiredSessionModal';
import { WarningSessionModal } from './modals/WarningSessionModal';
import { useSessionModal } from './useSessionModal';

type Props = {
  children: JSX.Element | JSX.Element[];
  readonly user: User;
};

export const UserProvider = ({ children = null, user }: Props): JSX.Element => {
  const {
    setShowExpiredModal,
    setShowWarningModal,
    showExpiredModal,
    showWarningModal,
  } = useSessionModal(user, 0.75);

  const handleCloseExpiredModal = useCallback(() => {
    setShowExpiredModal(false);
    const loginUrl =
      window.location.host === 'www.ovhtelecom.fr'
        ? 'https://www.ovh.com/auth/'
        : '/auth';

    const subsidiaryParams = user?.subsidiary
      ? `?ovhSubsidiary=${user.subsidiary}`
      : '';

    window.location.assign(`${loginUrl}${subsidiaryParams}`);
  }, [user]);

  const handleCloseWarningModal = () => setShowWarningModal(false);

  const memoizedUser = useMemo(() => ({ user }), []);

  return (
    <>
      <userContext.Provider value={memoizedUser}>
        {children}
      </userContext.Provider>
      {showExpiredModal && (
        <ExpiredSessionModal onClose={handleCloseExpiredModal} />
      )}
      {showWarningModal && (
        <WarningSessionModal onClose={handleCloseWarningModal} />
      )}
    </>
  );
};

export default UserProvider;
