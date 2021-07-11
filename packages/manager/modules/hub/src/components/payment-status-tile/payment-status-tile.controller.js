import { get, map } from 'lodash-es';
import { BillingService } from '@ovh-ux/manager-models';
import { SERVICE_STATES } from './payment-status-tile.constants';

export default class PaymentStatusTileCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    atInternet,
    coreConfig,
    coreURLBuilder,
    ovhFeatureFlipping,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.SERVICE_STATES = SERVICE_STATES;
  }

  $onInit() {
    const featureName = 'billing:management';
    this.loading = true;
    return this.$q
      .all({
        services: this.fetchServices(),
        billingManagementAvailability: this.ovhFeatureFlipping.checkFeatureAvailability(
          featureName,
        ),
      })
      .then(({ billingManagementAvailability }) => {
        this.autorenewLink = billingManagementAvailability.isFeatureAvailable(
          featureName,
        )
          ? this.coreURLBuilder.buildURL('dedicated', '#/billing/autorenew')
          : null;
      })
      .catch(() => {
        this.autorenewLink = null;
      })
      .finally(() => {
        this.loading = false;
      });
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
    return this.$http
      .get(`/hub/billingServices`, {
        serviceType: 'aapi',
      })
      .then((data) => {
        const billingServices = transformBillingServices(
          data.data.data.billingServices,
        );
        this.services = billingServices.data;
        this.totalCount = billingServices.count;
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
