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
  const {
    setShowExpiredModal,
    setShowWarningModal,
    showExpiredModal,
    showWarningModal,
  } = useSessionModal(user, 0.75);

  const handleCloseExpiredModal = useCallback(() => {
    setShowExpiredModal(false);
    const redirectUrl = getRedirectLoginUrl(user);
    window.location.assign(redirectUrl);
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
