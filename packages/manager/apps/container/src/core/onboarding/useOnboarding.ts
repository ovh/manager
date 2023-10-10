import { v6 } from '@ovh-ux/manager-core-api';

import { isBetaForced } from '../container';

import {
  ONBOARDING_STATUS_ENUM,
  ONBOARDING_OPENED_STATE_ENUM,
} from './constants';

interface LocalStorageStatus {
  status: string;
}

export const useOnboarding = () => {
  const preferenceKey = 'NAV_RESHUFFLE_ONBOARDING';

  const getOnboardingFromLocalStorage = () => {
    return window.localStorage.getItem(preferenceKey);
  };

  const setOnboardingToLocalStorage = (value: LocalStorageStatus) => {
    window.localStorage.setItem(preferenceKey, JSON.stringify(value));
  };

  const createPreference = async () => {
    const value = { status: ONBOARDING_STATUS_ENUM.DISPLAYED };

    const createPromise = isBetaForced()
      ? Promise.resolve(setOnboardingToLocalStorage(value))
      : v6.post(`/me/preferences/manager`, {
        key: preferenceKey,
        value: JSON.stringify(value),
      }).then(({ data }) => data);

    return createPromise.then(() => value);
  };

  const updatePreference = async (value: LocalStorageStatus): Promise<LocalStorageStatus> => {
    const updatePromise = isBetaForced()
      ? Promise.resolve(setOnboardingToLocalStorage(value))
      : v6.put(`/me/preferences/manager/${preferenceKey}`, {
        value: JSON.stringify(value),
      }).then(({ data }) => data);

    return updatePromise.then(() => value);
  };

  const init = async () => {
    const getPreferencesPromise: Promise<{ value: string }> = isBetaForced()
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
      : v6.get(`/me/preferences/manager/${preferenceKey}`).then(({ data }) => data);

    return getPreferencesPromise
      .then(({ value }: { value: string }) => {
        try {
          return JSON.parse(value);
        } catch (err) {
          return updatePreference({ status: ONBOARDING_STATUS_ENUM.DISPLAYED });
        }
      })
      .catch((error: Error) => {
        if (error?.status === 404) {
          return createPreference();
        }
        throw error;
      })
      .then((parsedValue: LocalStorageStatus) => {
        return parsedValue.status;
      });
  };

  const getOpenedStateFromStatus = (onboardingStatus: string) => {
    return onboardingStatus === ONBOARDING_STATUS_ENUM.DISPLAYED
      ? ONBOARDING_OPENED_STATE_ENUM.WELCOME
      : ONBOARDING_OPENED_STATE_ENUM.CLOSED;
  };

  const hasStarted = (openedState: string) => {
    return openedState === ONBOARDING_OPENED_STATE_ENUM.WALKME;
  };

  const getNextOpenedState = (openedState: string) => {
    return openedState === ONBOARDING_OPENED_STATE_ENUM.CLOSED
      ? ONBOARDING_OPENED_STATE_ENUM.WELCOME
      : openedState;
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
