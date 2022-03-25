import React, { useState, useMemo } from 'react';

import useOnboarding from '@/core/onboarding';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import OnboardingIntroduction from './introduction';
import OnboardingWalkMe from './walkMe';

export const NavReshuffleOnboardingWidget = () => {
  const onboarding = useOnboarding();
  const productNavReshuffle = useProductNavReshuffle();

  const [isWalkMeVisible, setIsWalkMeVisible] = useState();

  useMemo(() => {
    setIsWalkMeVisible(
      onboarding.hasStarted(productNavReshuffle.onboardingOpenedState),
    );
  }, [productNavReshuffle.onboardingOpenedState]);

  return (
    <>
      {!isWalkMeVisible && <OnboardingIntroduction />}
      {isWalkMeVisible && <OnboardingWalkMe />}
    </>
  );
};

export default NavReshuffleOnboardingWidget;
