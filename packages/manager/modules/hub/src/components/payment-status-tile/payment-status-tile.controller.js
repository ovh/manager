import get from 'lodash/get';

import AutorenewService from './AutorenewService.class';
import {
  AUTORENEW_URL,
  DEFAULT_REGION,
  NUMBER_OF_RECORDS,
  SERVICE_STATES,
} from './payment-status-tile.constants';

export default class PaymentStatusTileCtrl {
  /* @ngInject */
  constructor($q, atInternet, coreConfig, OvhApiBillingAutorenewServices) {
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.OvhApiBillingAutorenewServices = OvhApiBillingAutorenewServices;

    this.SERVICE_STATES = SERVICE_STATES;

    this.data = {
      records: [],
      badgeText: '',
      autorenewLink: '',
      loading: false,
    };
  }

  $onInit() {
    this.data.loading = true;
    this.data.autorenewLink = get(
      AUTORENEW_URL,
      this.coreConfig.getRegion(),
      get(AUTORENEW_URL, DEFAULT_REGION),
    );
    this.$q
      .all([
        this.OvhApiBillingAutorenewServices.Aapi().query({
          status: 'auto',
          count: 1,
          offset: 0,
        }).$promise,
        this.OvhApiBillingAutorenewServices.Aapi().query({
          count: NUMBER_OF_RECORDS,
          offset: 0,
          order: { predicate: 'serviceId', reverse: false },
        }).$promise,
      ])
      .then(([autoRenewData, recordData]) => {
        this.data.records = recordData.list.results.map(
          (record) => new AutorenewService(record),
        );
        this.data.badgeText = `${recordData.count - autoRenewData.count}`;
      })
      .finally(() => {
        this.data.loading = false;
      });
  }

  getManageServiceLink(serviceName) {
    return `${this.data.autorenewLink}?searchText=${serviceName}`;
  }
}
