import { useReket } from '@ovh-ux/ovh-reket';

import { isBetaForced } from '../container';

import {
  ONBOARDING_STATUS_ENUM,
  ONBOARDING_OPENED_STATE_ENUM,
} from './constants';

interface LocalStorageStatus {
  status: string;
}

export const useOnboarding = () => {
  const reketInstance = useReket();
  const preferenceKey = 'NAV_RESHUFFLE_ONBOARDING';

  const getOnboardingFromLocalStorage = () => {
    return window.localStorage.getItem(preferenceKey);
  };

  const setOnboardingToLocalStorage = (value: LocalStorageStatus) => {
    window.localStorage.setItem(preferenceKey, JSON.stringify(value));
  };

  // Onboarding forced only for PNR V2 alpha; to remove for the beta.
  const forceOnboardingDisplayed = (value: boolean) => {
    value
      ? window.localStorage.setItem(
          preferenceKey,
          JSON.stringify({ status: ONBOARDING_STATUS_ENUM.DISPLAYED }),
        )
      : window.localStorage.setItem(
          preferenceKey,
          JSON.stringify({ status: ONBOARDING_STATUS_ENUM.DONE }),
        );
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

  const updatePreference = (value: LocalStorageStatus): LocalStorageStatus => {
    const updatePromise = isBetaForced()
      ? Promise.resolve(setOnboardingToLocalStorage(value))
      : reketInstance.put(`/me/preferences/manager/${preferenceKey}`, {
          value: JSON.stringify(value),
        });

    return updatePromise.then(() => value);
  };

  const init = async () => {
    const getPreferencesPromise: Promise<{ value: string }> = new Promise(
      (resolve, reject) => {
        const localStorageValue = getOnboardingFromLocalStorage();
        if (localStorageValue) {
          resolve({ value: localStorageValue });
        } else {
          const error = new Error();
          error.status = 404;
          reject(error);
        }
      },
    );

    // Uncomment for PNR V2 beta to check the api and not only the local storage.

    // const getPreferencesPromise: Promise<{ value: string }> = isBetaForced()
    // ? new Promise((resolve, reject) => {
    //     const localStorageValue = getOnboardingFromLocalStorage();
    //     if (localStorageValue) {
    //       resolve({ value: localStorageValue });
    //     } else {
    //       const error = new Error();
    //       error.status = 404;
    //       reject(error);
    //     }
    //   })
    // : reketInstance.get(`/me/preferences/manager/${preferenceKey}`);

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
    forceOnboardingDisplayed,
  };
};

export default useOnboarding;
