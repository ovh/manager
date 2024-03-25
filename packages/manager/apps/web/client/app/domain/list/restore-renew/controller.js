export default class webDomainRestoreRenewCtrl {
  /* @ngInject */
  constructor($window, constants) {
    this.$window = $window;
    this.constants = constants;
  }

  redirectToRenew() {
    this.$window.open(
      URI.expand(this.constants.renew, {
        serviceName: this.domains.map((domain) => domain.domain).join(' '),
      }).toString(),
      '_blank',
    );
  }
}
