import get from 'lodash/get';
import {
  DEFAULT_ASSET,
  DEFAULT_ASSET2X,
  DEFAULT_ASSET3X,
} from './mfa-enrollment.constants';

export default class mfaEnrollmentCtrl {
  /* @ngInject */
  constructor($state, CORE_MANAGER_URLS) {
    this.$state = $state;
    const mfaBaseUrl = get(CORE_MANAGER_URLS, 'dedicated');
    const mfaUrlPath = '#/useraccount/security/mfa';
    this.mfaUrl = `${mfaBaseUrl}/${mfaUrlPath}`;

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
