import { useEffect, useState } from 'react';

import { User } from '@/context/User/context';
import { useFetchServerTime } from '@/data/hooks/useUtils';
import { getRedirectLoginUrl } from '@/utils/url-builder';

export const useSessionModal = (user: User, warningPercentage: number) => {
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showExpiredModal, setShowExpiredModal] = useState<boolean>(false);
  const { data: currentServerTime, isError, isFetched } = useFetchServerTime();

  useEffect(() => {
    if (!isFetched) return undefined;

    const currentTime = isError ? Math.floor(Date.now() / 1000) : currentServerTime;
    const redirectUrl = getRedirectLoginUrl(user);

    if (!user) {
      window.location.assign(redirectUrl);
      return undefined;
    }

    const { exp, iat } = user;
    const duration = exp - iat;
    const warningTime = duration * warningPercentage;

    const timeElapsed = currentTime - iat;
    const remainingWarningTime = warningTime - timeElapsed;
    const remainingExpireTime = exp - currentTime;

    if (remainingExpireTime <= 0) {
      window.location.assign(redirectUrl);
      return undefined;
    }

    if (remainingWarningTime <= 0) {
      setShowWarningModal(true);

      const expireTimerId = setTimeout(() => {
        setShowExpiredModal(true);
      }, remainingExpireTime * 1000);

      return () => {
        clearTimeout(expireTimerId);
      };
    }

    const expireTimerId = setTimeout(() => {
      setShowExpiredModal(true);
    }, remainingExpireTime * 1000);

    const warningTimerId = setTimeout(() => {
      setShowWarningModal(true);
    }, remainingWarningTime * 1000);

    return () => {
      clearTimeout(expireTimerId);
      clearTimeout(warningTimerId);
    };
  }, [user, isFetched]);

  return {
    showExpiredModal,
    showWarningModal,
    setShowExpiredModal,
    setShowWarningModal,
  };
};
