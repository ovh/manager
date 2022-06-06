import isString from 'lodash/isString';
import { isTopLevelApplication } from '@ovh-ux/manager-config';

export default class WebAppCtrl {
  /* @ngInject */
  constructor(
    $document,
    $rootScope,
    $scope,
    $timeout,
    $translate,
    coreConfig,
    ovhFeatureFlipping,
  ) {
    this.$document = $document;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$rootScope = $rootScope;
    this.chatbotEnabled = false;
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.isTopLevelApplication = isTopLevelApplication();
  }

  $onInit() {
    this.navbarOptions = {
      toggle: {
        event: 'sidebar:loaded',
      },
      universe: this.coreConfig.getUniverse(),
    };

    this.$scope.$watch(
      () => this.$translate.instant('global_app_title'),
      (newVal) => {
        if (newVal !== 'global_app_title') {
          document.title = newVal;
        }
      },
    );

    this.$scope.$on('navbar.loaded', () => {
      this.isNavbarLoaded = true;
    });

    this.currentLanguage = this.coreConfig.getUserLanguage();
    this.user = this.coreConfig.getUser();

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
