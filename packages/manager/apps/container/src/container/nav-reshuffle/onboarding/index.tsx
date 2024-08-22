import { useState, useEffect } from 'react';
import useOnboarding from '@/core/onboarding';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import OnboardingIntroduction from './introduction';
import OnboardingWalkMe from './walkMe';

export const NavReshuffleOnboardingWidget = () => {
  const { showOnboarding, hasStarted } = useOnboarding();
  const { onboardingOpenedState, openOnboarding } = useProductNavReshuffle();

  const [isWalkMeVisible, setIsWalkMeVisible] = useState<boolean>();

  useEffect(() => {
    if (showOnboarding) {
      openOnboarding();
    }
  }, [showOnboarding]);

  useEffect(() => {
    setIsWalkMeVisible(hasStarted(onboardingOpenedState));
  }, [onboardingOpenedState]);

  return (
    <>
      {(!isWalkMeVisible && showOnboarding) && <OnboardingIntroduction />}
      {isWalkMeVisible && <OnboardingWalkMe />}
    </>
  );
};

export default NavReshuffleOnboardingWidget;
