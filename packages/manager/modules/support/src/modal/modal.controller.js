import { GUIDES_LINK } from './modal.constants';

export default class HelpCenterModalController {
  /* @ngInject */
  constructor(coreConfig, $window) {
    this.coreConfig = coreConfig;
    this.$window = $window;
  }

  onClick() {
    this.$window.open(GUIDES_LINK.DEFAULT, '_blank');
  }
}
