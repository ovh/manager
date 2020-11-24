import { Environment } from '@ovh-ux/manager-config';

export default class TelecomAppCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
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
    this.betaPreferenceService = betaPreferenceService;
    this.ovhUserPref = ovhUserPref;
  }

  $onInit() {
    this.currentLanguage = Environment.getUserLanguage();
    this.user = Environment.getUser();

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
