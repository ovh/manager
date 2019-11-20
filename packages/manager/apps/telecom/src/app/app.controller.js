export default class TelecomAppCtrl {
  /* @ngInject */
  constructor($q, $state, $transitions, ovhUserPref) {
    this.displayFallbackMenu = false;
    $transitions.onStart({}, () => this.closeSidebar());

    this.$q = $q;
    this.$state = $state;
    this.ovhUserPref = ovhUserPref;
  }

  $onInit() {
    const beta = localStorage.getItem('ACCOUNT_BETA_FEATURES');
    return (beta ? this.$q.resolve(beta)
      : this.ovhUserPref.getValue('ACCOUNT_BETA_FEATURES'))
      .then(() => {
        this.globalSearchLink = this.$state.href('telecomSearch', {});
      })
      .catch(() => {
        this.globalSearchLink = null;
      });
  }

  openSidebar() {
    this.displayFallbackMenu = true;
    $('#sidebar-menu').addClass('displayFallbackMenu');
  }

  closeSidebar() {
    this.displayFallbackMenu = false;
    $('#sidebar-menu').removeClass('displayFallbackMenu');
  }
}
