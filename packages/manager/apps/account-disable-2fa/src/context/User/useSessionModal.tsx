import { useEffect, useState } from 'react';
import { User } from '@/context/User/context';

export const useSessionModal = (user: User, warningPercentage: number) => {
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showExpiredModal, setShowExpiredModal] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return undefined;

    const { exp, iat } = user;
    const duration = exp - iat;
    const warningTime = duration * warningPercentage;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeElapsed = currentTime - iat;
    const remainingWarningTime = warningTime - timeElapsed;
    const remainingExpireTime = exp - currentTime;

    if (remainingExpireTime <= 0) {
      setShowExpiredModal(true);
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
  }, [user]);

  return {
    showExpiredModal,
    showWarningModal,
    setShowExpiredModal,
    setShowWarningModal,
  };
};
