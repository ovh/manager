import { Environment } from '@ovh-ux/manager-config';

export default class TelecomAppCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $rootScope,
    $scope,
    $transitions,
    $translate,
    betaPreferenceService,
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
    this.betaPreferenceService = betaPreferenceService;
    this.ovhUserPref = ovhUserPref;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.chatbotEnabled = false;
  }

  $onInit() {
    this.navbarOptions = {
      toggle: {
        event: 'sidebar:loaded',
      },
      universe: Environment.getUniverse(),
    };
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

    return this.betaPreferenceService.isBetaActive().then((beta) => {
      this.globalSearchLink = beta
        ? this.$state.href('telecomSearch', {})
        : null;
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
}
