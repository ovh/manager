import { useReket } from '@ovh-ux/ovh-reket';

import { isBetaForced } from '../container';

import {
  ONBOARDING_STATUS_ENUM,
  ONBOARDING_OPENED_STATE_ENUM,
} from './constants';

export const useOnboarding = () => {
  const reketInstance = useReket();
  const preferenceKey = 'NAV_RESHUFFLE_ONBOARDING';

  const getOnboardingFromLocalStorage = () => {
    return window.localStorage.getItem(preferenceKey);
  };

  const setOnboardingToLocalStorage = (value) => {
    window.localStorage.setItem(preferenceKey, JSON.stringify(value));
    return null;
  };

  const createPreference = () => {
    const value = { status: ONBOARDING_STATUS_ENUM.DISPLAYED };

    const createPromise = isBetaForced()
      ? Promise.resolve(setOnboardingToLocalStorage(value))
      : reketInstance.post(`/me/preferences/manager`, {
          key: preferenceKey,
          value: JSON.stringify(value),
        });

    return createPromise.then(() => value);
  };

  const updatePreference = (value) => {
    const updatePromise = isBetaForced()
      ? Promise.resolve(setOnboardingToLocalStorage(value))
      : reketInstance.put(`/me/preferences/manager/${preferenceKey}`, {
          value: JSON.stringify(value),
        });

    return updatePromise.then(() => value);
  };

  const init = () => {
    const getPreferencesPromise = isBetaForced()
      ? new Promise((resolve, reject) => {
          const localStorageValue = getOnboardingFromLocalStorage();
          if (localStorageValue) {
            resolve({ value: localStorageValue });
          } else {
            const error = new Error();
            error.status = 404;
            reject(error);
          }
        })
      : reketInstance.get(`/me/preferences/manager/${preferenceKey}`);

    return getPreferencesPromise
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
