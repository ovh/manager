import isString from 'lodash/isString';
import set from 'lodash/set';
import startsWith from 'lodash/startsWith';
import { isTopLevelApplication } from '@ovh-ux/manager-config';

angular.module('App').controller(
  'SessionCtrl',
  class SessionCtrl {
    /* @ngInject */
    constructor(
      $document,
      $rootScope,
      $scope,
      $state,
      $transitions,
      $translate,
      coreConfig,
      ovhFeatureFlipping,
    ) {
      this.$document = $document;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$state = $state;
      this.$transitions = $transitions;
      this.$translate = $translate;
      this.coreConfig = coreConfig;
      this.ovhFeatureFlipping = ovhFeatureFlipping;
      this.chatbotEnabled = false;
      this.isTopLevelApplication = isTopLevelApplication();
    }

    $onInit() {
      this.$scope.$on('switchUniverse', (event, universe) => {
        this.sidebarNamespace = universe === 'server' ? undefined : 'hpc';
        this.$transitions.onSuccess({}, (transition) => {
          // Prevent displaying `server` as the current universe if user is
          // browsing in account/billing section.
          if (startsWith(transition.to().name, 'app.account')) {
            this.navbarOptions.universe = undefined;
          } else {
            this.navbarOptions.universe = universe;
          }
        });
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
