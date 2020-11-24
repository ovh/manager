import { isString } from 'lodash-es';

import { Environment } from '@ovh-ux/manager-config';

export default class HubController {
  /* @ngInject */
  constructor($document) {
    this.$document = $document;
  }

  $onInit() {
    this.currentLanguage = Environment.getUserLanguage();
    this.user = Environment.getUser();
  }

  /**
   * Set focus on the specified element.
   * @param  {string} id Element to locate.
   * @return {void}
   */
  setFocus(id) {
    if (isString(id)) {
      const [element] = this.$document.find(`#${id}`);
      element.focus();
    }
  }
}
