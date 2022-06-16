import {
  DEFAULT_ASSET,
  DEFAULT_ASSET2X,
  DEFAULT_ASSET3X,
} from './mfa-enrollment.constants';

export default class mfaEnrollmentCtrl {
  /* @ngInject */
  constructor($state, coreURLBuilder) {
    this.$state = $state;
    this.mfaUrl = coreURLBuilder.buildURL(
      'dedicated',
      '#/useraccount/security/mfa',
    );

    this.DEFAULT_ASSET = DEFAULT_ASSET;
    this.DEFAULT_ASSET2X = DEFAULT_ASSET2X;
    this.DEFAULT_ASSET3X = DEFAULT_ASSET3X;
  }

  $onInit() {
    this.forced = this.$state.params.forced;
  }

  goBack() {
    if (this.from) {
      window.history.back();
    } else {
      this.$state.go(this.rootState);
    }
  }
}
