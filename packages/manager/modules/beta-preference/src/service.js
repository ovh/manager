import { BETA_PREFERENCE } from './constants';

export default class BetaPreference {
  /* @ngInject */
  constructor($q, ovhUserPref) {
    this.$q = $q;
    this.ovhUserPref = ovhUserPref;
  }

  isBetaActive() {
    const betaPreference = localStorage.getItem(BETA_PREFERENCE);
    return betaPreference
      ? this.$q.resolve(betaPreference)
      : this.ovhUserPref
          .getValue(BETA_PREFERENCE)
          .then(() => true)
          .catch(() => false);
  }
}
