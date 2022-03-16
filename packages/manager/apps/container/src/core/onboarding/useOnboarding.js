import { useReket } from '@ovh-ux/ovh-reket';

import {
  ONBOARDING_STATUS_ENUM,
  ONBOARDING_OPENED_STATE_ENUM,
} from './constants';

export const useOnboarding = () => {
  const reketInstance = useReket();
  const preferenceKey = 'NAV_RESHUFFLE_ONBOARDING';

  const createPreference = () => {
    const value = { status: ONBOARDING_STATUS_ENUM.DISPLAYED };

    return reketInstance
      .post(`/me/preferences/manager`, {
        key: preferenceKey,
        value: JSON.stringify(value),
      })
      .then(() => {
        return value;
      });
  };

  const updatePreference = (value) => {
    return reketInstance
      .put(`/me/preferences/manager/${preferenceKey}`, {
        value: JSON.stringify(value),
      })
      .then(() => {
        return value;
      });
  };

  const init = () => {
    return reketInstance
      .get(`/me/preferences/manager/${preferenceKey}`)
      .then(({ value }) => {
        try {
          return JSON.parse(value);
        } catch (err) {
          return updatePreference({ status: ONBOARDING_STATUS_ENUM.DISPLAYED });
        }
      })
      .catch((error) => {
        if (error?.status === 404) {
          return createPreference();
        }
        throw error;
      })
      .then((parsedValue) => {
        return parsedValue.status;
      });
  };

  const getOpenedStateFromStatus = (onboardingStatus) => {
    switch (onboardingStatus) {
      case ONBOARDING_STATUS_ENUM.DISPLAYED:
        return ONBOARDING_OPENED_STATE_ENUM.WELCOME;
      default:
        return ONBOARDING_OPENED_STATE_ENUM.CLOSED;
    }
  };

  const hasStarted = (openedState) => {
    return openedState === ONBOARDING_OPENED_STATE_ENUM.WALKME;
  };

  const getNextOpenedState = (openedState) => {
    switch (openedState) {
      case ONBOARDING_OPENED_STATE_ENUM.CLOSED:
        return ONBOARDING_OPENED_STATE_ENUM.BUTTON;
      case ONBOARDING_OPENED_STATE_ENUM.BUTTON:
        return ONBOARDING_OPENED_STATE_ENUM.WELCOME;
      default:
        return openedState;
    }
  };

  return {
    init,
    updatePreference,
    getOpenedStateFromStatus,
    hasStarted,
    getNextOpenedState,
  };
};

export default useOnboarding;
