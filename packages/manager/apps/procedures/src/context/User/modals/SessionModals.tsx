import React, { FunctionComponent, useCallback, useContext } from 'react';
import { useSessionModal } from '../useSessionModal';
import { getRedirectLoginUrl } from '@/utils/url-builder';
import { ExpiredSessionModal } from './ExpiredSessionModal';
import { WarningSessionModal } from './WarningSessionModal';
import userContext from '../context';

export const SessionModals: FunctionComponent = () => {
  const { user } = useContext(userContext);
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

  return (
    <>
      {showExpiredModal && (
        <ExpiredSessionModal onClose={handleCloseExpiredModal} />
      )}
      {showWarningModal && (
        <WarningSessionModal onClose={handleCloseWarningModal} />
      )}
    </>
  );
};
