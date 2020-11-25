import { isString } from 'lodash-es';

import { Environment } from '@ovh-ux/manager-config';

export default class HubController {
  /* @ngInject */
  constructor($document, $scope) {
    this.$document = $document;
    this.$scope = $scope;
    this.chatbotEnabled = false;
  }

  $onInit() {
    this.currentLanguage = Environment.getUserLanguage();
    this.user = Environment.getUser();
    const unregisterListener = this.$scope.$on('app:started', () => {
      this.chatbotEnabled = true;
      unregisterListener();
    });
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
