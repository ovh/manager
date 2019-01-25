import _ from 'lodash';

export default class TelecomTelephonyGuidesCtrl {
  /* @ngInject */

  constructor(TELEPHONY_GUIDES) {
    this.constant = { TELEPHONY_GUIDES };
  }

  $onInit() {
    this.loading = {
      init: false,
    };
    this.guides = null;
    this.language = null;
    this.count = null;

    this.guides = this.constant.TELEPHONY_GUIDES;
    if (localStorage['univers-selected-language']) {
      this.language = localStorage['univers-selected-language'].replace(/-.*$|_.*$/, '');
    } else if (navigator.language || navigator.userLanguage) {
      this.language = (navigator.language || navigator.userLanguage).replace(/-.*$|_.*$/, '');
    }
    this.countGuides();
  }

  /**
   * Count guides.
   */
  countGuides() {
    this.count = _.flatten(_.map(this.guides.sections, section => section.guides)).length;
  }

  /**
   * Has guides helper.
   * @return {Boolean}
   */
  hasGuides() {
    return this.count > 0;
  }
}
