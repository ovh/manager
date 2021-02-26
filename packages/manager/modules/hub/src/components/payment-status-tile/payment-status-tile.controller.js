import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { SERVICE_STATES } from './payment-status-tile.constants';

export default class PaymentStatusTileCtrl {
  /* @ngInject */
  constructor(atInternet, coreConfig) {
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;

    this.SERVICE_STATES = SERVICE_STATES;

    this.autorenewLink = this.coreConfig.isRegion(['EU', 'CA'])
      ? buildURL('dedicated', '#/billing/autorenew')
      : '';
  }

  onLinkClick() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::activity::payment-status::show-all`,
      type: 'action',
    });
  }

  getServiceManagementLink(service) {
    return `${this.autorenewLink}?searchText=${service.domain}`;
  }

  onServiceManagementClick() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::activity::payment-status::action::go-to-manage-service`,
      type: 'action',
    });
  }

  refreshTile() {
    this.loading = true;
    return this.refresh()
      .then(({ count, data }) => {
        this.totalCount = count;
        this.services = data;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
