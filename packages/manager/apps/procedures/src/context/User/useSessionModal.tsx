import { useEffect, useState } from 'react';
import { User } from '@/context/User/context';
import { useFetchServerTime } from '@/data/hooks/useUtils';
import { getRedirectLoginUrl } from '@/utils/url-builder';

export const useSessionModal = (user: User, warningPercentage: number) => {
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showExpiredModal, setShowExpiredModal] = useState<boolean>(false);
  const { data: currentServerTime, isError, isFetched } = useFetchServerTime();

  useEffect(() => {
    if (isError || !isFetched) return undefined;
    if (!user) return undefined;

    const { exp, iat } = user;
    const duration = exp - iat;
    const warningTime = duration * warningPercentage;

    const timeElapsed = currentServerTime - iat;
    const remainingWarningTime = warningTime - timeElapsed;
    const remainingExpireTime = exp - currentServerTime;

    if (remainingExpireTime <= 0) {
      setShowExpiredModal(true);
      const redirectUrl = getRedirectLoginUrl(user);
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
