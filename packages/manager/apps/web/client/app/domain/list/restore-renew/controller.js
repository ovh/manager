import {
  DOMAIN_PREFIX_POPUP_BUTTON_RENEW_GO_TO_ORDER,
  DOMAIN_PREFIX_POPUP_BUTTON_RENEW_CANCEL,
} from '../../../domains/domains.constant';

export default class WebDomainRestoreRenewCtrl {
  /* @ngInject */
  constructor($window, constants, atInternet) {
    this.$window = $window;
    this.constants = constants;
    this.atInternet = atInternet;
  }

  closeModal() {
    this.atInternet.trackClick({
      name: DOMAIN_PREFIX_POPUP_BUTTON_RENEW_CANCEL,
      type: 'action',
    });
    return this.goBack();
  }

  redirectToRenew() {
    this.atInternet.trackClick({
      name: DOMAIN_PREFIX_POPUP_BUTTON_RENEW_GO_TO_ORDER,
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
