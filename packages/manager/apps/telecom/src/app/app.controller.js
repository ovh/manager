export default class TelecomAppCtrl {
  /* @ngInject */
  constructor($transitions) {
    this.displayFallbackMenu = false;
    $transitions.onStart({}, () => this.closeSidebar());
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
