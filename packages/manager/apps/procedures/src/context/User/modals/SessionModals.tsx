import React, { FunctionComponent, useCallback, useContext } from 'react';

import { getRedirectLoginUrl } from '@/utils/url-builder';

import userContext from '../context';
import { useSessionModal } from '../useSessionModal';
import { ExpiredSessionModal } from './ExpiredSessionModal';
import { WarningSessionModal } from './WarningSessionModal';

export const SessionModals: FunctionComponent = () => {
  const context = useContext(userContext);

  const { user } = context;
  const { setShowExpiredModal, setShowWarningModal, showExpiredModal, showWarningModal } =
    useSessionModal(user, 0.75);

  const handleCloseExpiredModal = useCallback(() => {
    setShowExpiredModal(false);
    const redirectUrl = getRedirectLoginUrl(user);
    window.location.assign(redirectUrl);
  }, [user]);

  const handleCloseWarningModal = () => setShowWarningModal(false);

  return (
    <>
      {showExpiredModal && <ExpiredSessionModal onClose={handleCloseExpiredModal} />}
      {showWarningModal && <WarningSessionModal onClose={handleCloseWarningModal} />}
    </>
  );
};
