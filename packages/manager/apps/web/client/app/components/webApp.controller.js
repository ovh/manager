import isString from 'lodash/isString';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { getShellClient } from '../shell';

export default class WebAppCtrl {
  /* @ngInject */
  constructor($document, $scope, $timeout, $translate) {
    this.$document = $document;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.isTopLevelApplication = isTopLevelApplication();
    this.shell = getShellClient();
    this.shell.ux.isMenuSidebarVisible().then((isMenuSidebarVisible) => {
      this.isMenuSidebarVisible = isMenuSidebarVisible;
    });
  }

  $onInit() {
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

    // Scroll to anchor id
    this.$scope.scrollTo = (id) => {
      // Set focus to target
      if (isString(id)) {
        this.$document[0].getElementById(id).focus();
      }
    };

    this.shell.ux.onRequestClientSidebarOpen(() =>
      this.$timeout(() => this.openSidebar()),
    );
  }

  openSidebar() {
    this.sidebarIsOpen = true;
  }

  closeSidebar() {
    this.sidebarIsOpen = false;
  }
}

angular.module('App').controller('WebAppCtrl', WebAppCtrl);
