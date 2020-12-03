import isString from 'lodash/isString';
import { Environment } from '@ovh-ux/manager-config';

export default class WebAppCtrl {
  /* @ngInject */
  constructor(
    $document,
    $rootScope,
    $scope,
    $timeout,
    $translate,
    ovhFeatureFlipping,
  ) {
    this.$document = $document;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$rootScope = $rootScope;
    this.chatbotEnabled = false;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.$scope.$watch(
      () => this.$translate.instant('global_app_title'),
      () => {
        document.title = this.$translate.instant('global_app_title');
      },
    );

    this.$scope.$on('navbar.loaded', () => {
      this.isNavbarLoaded = true;
    });

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

    // Scroll to anchor id
    this.$scope.scrollTo = (id) => {
      // Set focus to target
      if (isString(id)) {
        this.$document[0].getElementById(id).focus();
      }
    };
  }

  openSidebar() {
    this.sidebarIsOpen = true;
  }

  closeSidebar() {
    this.sidebarIsOpen = false;
  }
}

angular.module('App').controller('WebAppCtrl', WebAppCtrl);
