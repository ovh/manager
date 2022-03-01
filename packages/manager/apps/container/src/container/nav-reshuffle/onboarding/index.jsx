import React from 'react';

import useOnboarding from '@/core/onboarding';

import OnboardingIntroduction from './introduction';
import OnboardingWalkMe from './walkMe';

export const NavReshuffleOnboardingWidget = () => {
  const { isWalkMeVisible } = useOnboarding();

  return (
    <>
      {!isWalkMeVisible && <OnboardingIntroduction />}
      {isWalkMeVisible && <OnboardingWalkMe />}
    </>
  );
};

export default NavReshuffleOnboardingWidget;
