import { isString } from 'lodash-es';

import { Environment } from '@ovh-ux/manager-config';

export default class HubController {
  /* @ngInject */
  constructor($document, $scope, $rootScope, ovhFeatureFlipping) {
    this.$document = $document;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.chatbotEnabled = false;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.currentLanguage = Environment.getUserLanguage();
    this.user = Environment.getUser();
    const unregisterListener = this.$scope.$on('app:started', () => {
      const CHATBOT_FEATURE = 'chatbot';
      this.ovhFeatureFlipping
        .checkFeatureAvailability(CHATBOT_FEATURE)
        .then((featureAvailability) => {
          this.chatbotEnabled = featureAvailability.isFeatureAvailable(
            CHATBOT_FEATURE,
          );
          if (this.chatbotEnabled) {
            this.$rootScope.$broadcast(
              'ovh-chatbot:enable',
              this.chatbotEnabled,
            );
          }
        });
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
