import { LEGACY_URLS } from './forward.constants';

export default class {
  /* @ngInject */
  constructor($uibModalInstance, $window, coreConfig, feedbackUrl) {
    this.$uibModalInstance = $uibModalInstance;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.feedbackUrl = feedbackUrl;
  }

  goToFeedback() {
    return this.$window.open(this.feedbackUrl, '_blank');
  }

  goToLegacy() {
    this.$window.location = LEGACY_URLS[this.coreConfig.getRegion()];
  }
}
