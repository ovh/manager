import get from 'lodash/get';
import set from 'lodash/set';

import {
  RESOURCE_BILLING_TYPES,
  RESOURCE_STATES,
  RESOURCE_UPGRADE_TYPES,
} from '../../resource/upgrade/upgrade.constants';

import { DEDICATED_CLOUD_DATACENTER } from '../dedicatedCloud-datacenter.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    DedicatedCloud,
    dedicatedCloudDataCenterHostService,
    ovhManagerPccDatacenterService,
  ) {
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.dedicatedCloudDataCenterHostService = dedicatedCloudDataCenterHostService;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
    this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
    this.RESOURCE_BILLING_TYPES = RESOURCE_BILLING_TYPES;
    this.RESOURCE_UPGRADE_TYPES = RESOURCE_UPGRADE_TYPES;
    this.RESOURCE_STATES = RESOURCE_STATES;
  }

  $onInit() {
    this.datacenter.model.commercialRangeName = this.commercialRangeName;
    this.$serviceConsumption = this.ovhManagerPccDatacenterService.fetchConsumptionForService(
      this.serviceId,
    );
  }

  fetchLegacyHostConsumption(host) {
    return host.billingType === this.RESOURCE_BILLING_TYPES.hourly
      ? this.dedicatedCloudDataCenterHostService
          .getHostHourlyConsumption(
            this.productId,
            this.datacenterId,
            host.hostId,
          )
          .then((consumption) => {
            set(host, 'consumption', consumption);
          })
          .catch(() => null)
      : host;
  }

  fetchConsumptionForHost(host) {
    return (serviceConsumption) => {
      if (
        serviceConsumption &&
        host.billingType === this.RESOURCE_BILLING_TYPES.hourly &&
        host.state === RESOURCE_STATES.delivered
      ) {
        const hostConsumption = this.ovhManagerPccDatacenterService.constructor.extractElementConsumption(
          serviceConsumption,
          {
            id: host.hostId,
            type: this.DEDICATED_CLOUD_DATACENTER.elementTypes.host,
          },
        );

        set(host, 'consumption', {
          value: get(hostConsumption, 'quantity', 0),
        });
        set(host, 'lastUpdate', serviceConsumption.lastUpdate);
      }

      return host;
    };
  }

  chooseConsumptionFetchingMethod(host) {
    return !this.usesLegacyOrder
      ? this.$serviceConsumption.then(this.fetchConsumptionForHost(host))
      : this.fetchLegacyHostConsumption(host);
  }

  fetchLocation(host) {
    return this.dedicatedCloudDataCenterHostService
      .getHostLocation(this.productId, this.datacenterId, host.hostId)
      .then((location) => {
        set(host, 'location', location);
      })
      .catch(() => null);
  }

  loadHosts({ offset, pageSize }) {
    return this.dedicatedCloudDataCenterHostService
      .getPaginatedHosts(this.productId, this.datacenterId, {
        pageSize,
        offset: offset - 1,
        sort: 'hostId',
      })
      .then(({ data, meta }) => {
        data.forEach((host) => {
          set(host, 'asyncLoading', true);
          this.$q
            .all([
              this.chooseConsumptionFetchingMethod(host),
              this.fetchLocation(host),
            ])
            .finally(() => {
              set(host, 'asyncLoading', false);
            });
        });
        return { data, meta };
      });
  }
}
