import isString from 'lodash/isString';
import { Environment } from '@ovh-ux/manager-config';

export default class WebAppCtrl {
  /* @ngInject */
  constructor($document, $rootScope, $scope, $timeout, $translate) {
    this.$document = $document;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$rootScope = $rootScope;
    this.chatbotEnabled = false;
  }

  $onInit() {
    this.navbarOptions = {
      toggle: {
        event: 'sidebar:loaded',
      },
      universe: Environment.getUniverse(),
    };

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
      this.chatbotEnabled = true;
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
