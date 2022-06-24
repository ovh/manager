import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { getShellClient } from './shell';

export default class TelecomAppCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $rootScope,
    $scope,
    $timeout,
    $transitions,
    $translate,
    betaPreferenceService,
    coreConfig,
    ovhUserPref,
    ovhFeatureFlipping,
  ) {
    this.displayFallbackMenu = false;
    $transitions.onStart({}, () => this.closeSidebar());

    this.$q = $q;
    this.$translate = $translate;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.betaPreferenceService = betaPreferenceService;
    this.coreConfig = coreConfig;
    this.ovhUserPref = ovhUserPref;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.isTopLevelApplication = isTopLevelApplication();

    this.shell = getShellClient();
    this.chatbotEnabled = false;
    this.SYSTRAN_FEEDBACK_INFO = {
      part1:
        'The text in this manager section is provided by Systran machine translation.',
      part2: 'Share your feedback here.',
    };
    this.SYSTRAN_FEEDBACK_LINK =
      'https://survey.ovh.com/index.php/175287?lang=en';

    this.shell.ux.isMenuSidebarVisible().then((isMenuSidebarVisible) => {
      this.isMenuSidebarVisible = isMenuSidebarVisible;
    });
  }

  $onInit() {
    this.navbarOptions = {
      toggle: {
        event: 'sidebar:loaded',
      },
      universe: this.coreConfig.getUniverse(),
    };
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

    this.shell.ux.onRequestClientSidebarOpen(() =>
      this.$timeout(() => this.openSidebar()),
    );

    return this.betaPreferenceService.isBetaActive().then((beta) => {
      this.globalSearchLink = beta
        ? this.$state.href('telecomSearch', {})
        : null;
      this.sidebarUniverse = beta ? 'TELECOM_BETA' : 'TELECOM';
    });
  }

  openSidebar() {
    this.displayFallbackMenu = true;
    $('#sidebar-menu').addClass('nav-open');
  }

  closeSidebar() {
    this.displayFallbackMenu = false;
    $('#sidebar-menu').removeClass('nav-open');
  }

  onChatbotOpen() {
    this.shell.ux.onChatbotOpen();
  }

  onChatbotClose(reduced) {
    this.shell.ux.onChatbotClose(reduced);
  }
}
