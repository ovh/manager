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
      $rootScope,
      $scope,
      $state,
      $timeout,
      $transitions,
      $translate,
      coreConfig,
      ovhFeatureFlipping,
    ) {
      this.$document = $document;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$transitions = $transitions;
      this.$translate = $translate;
      this.coreConfig = coreConfig;
      this.ovhFeatureFlipping = ovhFeatureFlipping;
      this.chatbotEnabled = false;
      this.isTopLevelApplication = isTopLevelApplication();
      this.shell = getShellClient();
      this.shell.ux.isMenuSidebarVisible().then((isMenuSidebarVisible) => {
        this.isMenuSidebarVisible = isMenuSidebarVisible;
      });
    }

    $onInit() {
      this.$scope.$on('switchUniverse', (event, universe) => {
        this.sidebarNamespace = universe === 'server' ? undefined : 'hpc';
        this.navbarOptions.universe = universe;
        this.shell.environment.setUniverse(universe);
        this.coreConfig.setUniverse(universe);
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

      this.navbarOptions = {
        toggle: {
          event: 'sidebar:loaded',
        },
        universe: 'server',
      };

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

    onChatbotOpen() {
      this.shell.ux.onChatbotOpen();
    }

    onChatbotClose(reduced) {
      this.shell.ux.onChatbotClose(reduced);
    }
  },
);
