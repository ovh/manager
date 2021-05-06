import { get, map } from 'lodash-es';
import { BillingService } from '@ovh-ux/manager-models';
import { SERVICE_STATES } from './payment-status-tile.constants';

export default class PaymentStatusTileCtrl {
  /* @ngInject */
  constructor($http, atInternet, coreConfig, coreURLBuilder) {
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.$http = $http;

    this.SERVICE_STATES = SERVICE_STATES;

    this.autorenewLink = this.coreConfig.isRegion(['EU', 'CA'])
      ? coreURLBuilder.buildURL('dedicated', '#/billing/autorenew')
      : '';
    this.loading = true;
  }

  $onInit() {
    this.fetchServices();
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

  fetchServices() {
    const transformBillingServices = (services) => {
      return services.status === 'ERROR'
        ? services
        : {
            count: get(services, 'data.count'),
            data: map(services.data.data, (service) => {
              return new BillingService(service);
            }),
          };
    };
    this.$http
      .get(`/hub/billingServices`, {
        serviceType: 'aapi',
      })
      .then((data) => {
        const billingServices = transformBillingServices(
          data.data.data.billingServices,
        );
        this.services = billingServices.data;
        this.totalCount = billingServices.count;
      })
      .finally(() => {
        this.loading = false;
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
