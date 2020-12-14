import { Environment } from '@ovh-ux/manager-config';

export default class TelecomAppCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $scope,
    $transitions,
    $translate,
    betaPreferenceService,
    ovhUserPref,
  ) {
    this.displayFallbackMenu = false;
    $transitions.onStart({}, () => this.closeSidebar());

    this.$q = $q;
    this.$translate = $translate;
    this.$state = $state;
    this.$scope = $scope;
    this.betaPreferenceService = betaPreferenceService;
    this.ovhUserPref = ovhUserPref;

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
      this.chatbotEnabled = true;
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
