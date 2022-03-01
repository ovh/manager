import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useReket } from '@ovh-ux/ovh-reket';

import OnboardingContext from './context';
import { ONBOARDING_STATUS_ENUM } from './constants';

export const OnboardingProvider = ({ children }) => {
  const reketInstance = useReket();
  const preferenceKey = 'NAV_RESHUFFLE_ONBOARDING';

  const [isLoading, setIsLoading] = useState(true);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [isLetsGoBtnVisible, setIsLetsGoBtnVisible] = useState(false);
  const [isWelcomePopoverVisible, setIsWelcomePopoverVisible] = useState(false);
  const [isWalkMeVisible, setIsWalkMeVisible] = useState(false);

  let onboardingContext = useContext(OnboardingContext);

  const createOnboardingPreference = () => {
    return reketInstance.post(`/me/preferences/manager`, {
      key: preferenceKey,
      value: JSON.stringify({ status: ONBOARDING_STATUS_ENUM.DISPLAYED }),
    });
  };

  const updateOnboardingPreference = (status) => {
    return reketInstance.post(`/me/preferences/manager`, {
      key: preferenceKey,
      value: JSON.stringify({ status }),
    });
  };

  const displayOnboardingWidget = (forcePopoverDisplay) => {
    setIsWidgetVisible(true);
    if (isLetsGoBtnVisible || forcePopoverDisplay) {
      setIsWelcomePopoverVisible(true);
    }
    setIsLetsGoBtnVisible(true);
  };

  const hideOnboardingWidget = () => {
    setIsWidgetVisible(false);
    setIsLetsGoBtnVisible(false);
    setIsWelcomePopoverVisible(false);

    return updateOnboardingPreference(ONBOARDING_STATUS_ENUM.CLOSED);
  };

  const toggleWelcomPopoverVisibility = () => {
    setIsWelcomePopoverVisible(!isWelcomePopoverVisible);
  };

  const startWalkMe = () => {
    setIsLetsGoBtnVisible(false);
    setIsWelcomePopoverVisible(false);

    setIsWalkMeVisible(true);

    return updateOnboardingPreference(ONBOARDING_STATUS_ENUM.STARTED);
  };

  useEffect(() => {
    reketInstance
      .get(`/me/preferences/manager/${preferenceKey}`)
      .then(({ value }) => {
        const parsedValue = JSON.parse(value);
        if (parsedValue.status === ONBOARDING_STATUS_ENUM.DISPLAYED) {
          displayOnboardingWidget(true);
        }
      })
      .catch((error) => {
        if (error?.status === 404) {
          displayOnboardingWidget(true);
          return createOnboardingPreference();
        }
        throw error;
      })
      .finally(() => setIsLoading(false));
  }, []);

  onboardingContext = {
    isWidgetVisible,
    displayOnboardingWidget,
    hideOnboardingWidget,
    isLetsGoBtnVisible,
    isWelcomePopoverVisible,
    toggleWelcomPopoverVisibility,
    isWalkMeVisible,
    startWalkMe,
  };

  return (
    <OnboardingContext.Provider value={onboardingContext}>
      {!isLoading && children}
    </OnboardingContext.Provider>
  );
};

OnboardingProvider.propTypes = {
  children: PropTypes.any,
};

export default OnboardingProvider;
