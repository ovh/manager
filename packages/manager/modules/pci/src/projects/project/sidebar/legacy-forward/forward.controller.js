import { LEGACY_URLS } from './forward.constants';

export default class {
  /* @ngInject */
  constructor($uibModalInstance, $window, coreConfig) {
    this.$uibModalInstance = $uibModalInstance;
    this.$window = $window;
    this.coreConfig = coreConfig;
  }

  goToFeedback() {
    return this.$window.open(__FEEDBACK_URL__, '_blank');
  }

  goToLegacy() {
    this.$window.location = LEGACY_URLS[this.coreConfig.getRegion()];
  }
}
