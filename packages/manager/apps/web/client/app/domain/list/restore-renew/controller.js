export default class webDomainRestoreRenewCtrl {
  /* @ngInject */
  constructor($window, atInternet, constants, goBack) {
    this.$window = $window;
    this.constants = constants;
    this.atInternet = atInternet;
    this.goBack = goBack;
  }

  goBackWithTrackClick() {
    this.atInternet.trackClick({
      name: 'web::domain::::pop-up::button::renew-restore-domains::cancel',
      type: 'action',
    });
    this.goBack();
  }

  redirectToRenew() {
    this.atInternet.trackClick({
      name: 'web::domain::::pop-up::button::renew-restore-domains::go-to-order',
      type: 'action',
    });
    this.$window.open(
      URI.expand(this.constants.renew, {
        serviceName: this.domains.map((domain) => domain.domain).join(' '),
      }).toString(),
      '_blank',
    );
  }
}
