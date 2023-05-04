import isString from 'lodash/isString';
import set from 'lodash/set';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { getShellClient } from '../../../shell';

angular.module('App').controller(
  'SessionCtrl',
  class SessionCtrl {
    /* @ngInject */
    constructor(
      $document,
      $scope,
      $state,
      $timeout,
      $transitions,
      $translate,
      coreConfig,
    ) {
      this.$document = $document;
      this.$scope = $scope;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$transitions = $transitions;
      this.$translate = $translate;
      this.coreConfig = coreConfig;
      this.isTopLevelApplication = isTopLevelApplication();
      this.shell = getShellClient();
      this.shell.ux.isMenuSidebarVisible().then((isMenuSidebarVisible) => {
        this.isMenuSidebarVisible = isMenuSidebarVisible;
      });
    }

    $onInit() {
      this.$scope.$on('switchUniverse', (event, universe) => {
        this.sidebarNamespace = universe === 'server' ? undefined : 'hpc';
        this.shell.environment.setUniverse(universe);
        this.coreConfig.setUniverse(universe);
      });

      set(this.$document, 'title', this.$translate.instant('global_app_title'));

      this.hooksToUnsubscribe = [
        this.$transitions.onStart({}, () => {
          this.closeSidebar();
        }),
        this.$transitions.onSuccess({}, () => {
          this.displayAccountSidebar = [
            'support',
            'app.account',
            'app.otrs',
          ].some((name) => this.$state.includes(name));
        }),
      ];

      // Scroll to anchor id
      this.$scope.scrollTo = (id) => {
        // Set focus to target
        if (isString(id)) {
          this.$document.find(`#${id}`)[0].focus();
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

    $onDestroy() {
      this.hooksToUnsubscribe.forEach((hook) => hook());
    }
  },
);
