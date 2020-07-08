export default class TelecomAppCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $transitions,
    $translate,
    betaPreferenceService,
    SessionService,
    ovhUserPref,
  ) {
    this.displayFallbackMenu = false;
    $transitions.onStart({}, () => this.closeSidebar());

    this.$q = $q;
    this.$translate = $translate;
    this.$state = $state;
    this.betaPreferenceService = betaPreferenceService;
    this.ovhUserPref = ovhUserPref;
    this.SessionService = SessionService;
  }

  $onInit() {
    [this.currentLanguage] = this.$translate.use().split('_');

    this.SessionService.getUser().then((user) => {
      this.user = user;
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
