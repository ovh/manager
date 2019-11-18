import { BETA_PREFERENCE } from './constants';

export default class BetaPreferenceCtrl {
  /* @ngInject */
  constructor($translate, betaPreferenceService, ovhUserPref) {
    this.$translate = $translate;
    this.betaPreferenceService = betaPreferenceService;
    this.ovhUserPref = ovhUserPref;
  }

  $onInit() {
    this.beta = {
      active: false,
    };

    this.isUpdatingBeta = true;
    return this.betaPreferenceService.isBetaActive()
      .then((beta) => {
        this.beta.active = beta;
      })
      .finally(() => {
        this.isUpdatingBeta = false;
      });
  }

  onBetaChange(beta) {
    this.isUpdatingBeta = true;
    return this.ovhUserPref.assign(BETA_PREFERENCE, beta)
      .then(() => {
        this.beta.active = beta;
        return this.onSuccess({ message: this.$translate.instant('user_account_advanced_section_beta_success') });
      })
      .catch(() => this.onError({ message: this.$translate.instant('user_account_advanced_section_beta_error') }))
      .finally(() => {
        this.isUpdatingBeta = false;
      });
  }
}
