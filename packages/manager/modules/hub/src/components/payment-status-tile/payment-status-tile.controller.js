import { SERVICE_STATES } from './payment-status-tile.constants';

export default class PaymentStatusTileCtrl {
  /* @ngInject */
  constructor(atInternet, RedirectionService) {
    this.atInternet = atInternet;

    this.SERVICE_STATES = SERVICE_STATES;

    this.autorenewLink = RedirectionService.getURL('autorenew');
  }

  onLinkClick() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::show-all`,
      type: 'action',
    });
  }

  getServiceManagementLink(service) {
    return `${this.autorenewLink}?searchText=${service.domain}`;
  }

  onServiceManagementClick() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::action::go-to-manage-service`,
      type: 'action',
    });
  }
}
