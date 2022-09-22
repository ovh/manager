import { NOTEBOOK_PRIVACY_SETTINGS } from './privacy-selector.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    // define available compute engines
    this.availablePrivacy = NOTEBOOK_PRIVACY_SETTINGS;
  }

  /**
   * Handle change events
   */
  onChange(selectedPrivacy) {
    this.selectedPrivacy = selectedPrivacy;
    this.onChangeHandler(selectedPrivacy);
  }
}
