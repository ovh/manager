export const localStorageKey = 'NAV_RESHUFFLE_BETA_ACCESS';
export const betaVersionKey = 'NAV_RESHUFFLE_BETA_VERSION';

export const getBetaAvailabilityFromLocalStorage = () => {
  return window.localStorage.getItem(localStorageKey);
};

export const setBetaAvailabilityToLocalStorage = (accept: boolean) => {
  window.localStorage.setItem(localStorageKey, accept.toString());
};

export const isBetaForced = () => {
  return getBetaAvailabilityFromLocalStorage() !== null;
};

export const getBetaVersionFromLocalStorage = () => {
  const version = window.localStorage.getItem(betaVersionKey);
  return version ? parseInt(version, 10) : null;
};
