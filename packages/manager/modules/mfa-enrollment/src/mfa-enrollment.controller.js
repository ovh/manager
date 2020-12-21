import { buildURL } from '@ovh-ux/ufrontend/url-builder';

import {
  DEFAULT_ASSET,
  DEFAULT_ASSET2X,
  DEFAULT_ASSET3X,
} from './mfa-enrollment.constants';

export default class mfaEnrollmentCtrl {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
    this.mfaUrl = buildURL('dedicated', '#/useraccount/security/mfa');

    this.DEFAULT_ASSET = DEFAULT_ASSET;
    this.DEFAULT_ASSET2X = DEFAULT_ASSET2X;
    this.DEFAULT_ASSET3X = DEFAULT_ASSET3X;
  }

  $onInit() {
    this.forced = this.$state.params.forced;
  }

  goBack() {
    this.$state.go(this.from ? this.from : this.rootState);
  }
}
