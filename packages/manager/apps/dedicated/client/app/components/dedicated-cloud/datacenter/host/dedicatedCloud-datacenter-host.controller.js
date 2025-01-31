import get from 'lodash/get';

import {
  RESOURCE_BILLING_TYPES,
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
  }

  $onInit() {
    this.RESOURCE_BILLING_TYPES = RESOURCE_BILLING_TYPES;
    this.RESOURCE_UPGRADE_TYPES = RESOURCE_UPGRADE_TYPES;

    this.datacenter.model.commercialRangeName = this.commercialRangeName;
  }

  fetchLegacyHostConsumption(hosts) {
    return this.$q.all(
      hosts.map((host) =>
        host.billingType === this.RESOURCE_BILLING_TYPES.hourly
          ? this.dedicatedCloudDataCenterHostService
              .getHostHourlyConsumption(
                this.productId,
                this.datacenterId,
                host.hostId,
              )
              .then((consumption) => ({ ...host, ...consumption }))
              .catch(() => host)
          : host,
      ),
    );
  }

  fetchConsumptionForHosts(hosts) {
    return (serviceConsumption) =>
      this.$q.all(
        serviceConsumption
          ? hosts.map(this.fetchConsumptionForHost(serviceConsumption))
          : hosts,
      );
  }

  fetchConsumptionForHost(serviceConsumption) {
    return (host) => {
      if (
        host.billingType === this.RESOURCE_BILLING_TYPES.hourly &&
        host.status === 'DELIVERED'
      ) {
        const hostConsumption = this.ovhManagerPccDatacenterService.constructor.extractElementConsumption(
          serviceConsumption,
          {
            id: host.hostId,
            type: this.DEDICATED_CLOUD_DATACENTER.elementTypes.host,
          },
        );

        return {
          ...host,
          consumption: {
            value: get(hostConsumption, 'quantity', 0),
          },
          lastUpdate: serviceConsumption.lastUpdate,
        };
      }

      return host;
    };
  }

  chooseConsumptionFetchingMethod(hosts) {
    return !this.usesLegacyOrder
      ? this.ovhManagerPccDatacenterService
          .fetchConsumptionForService(this.serviceId)
          .then(this.fetchConsumptionForHosts(hosts))
      : this.fetchLegacyHostConsumption(hosts);
  }

  fetchLocations(hosts) {
    return this.$q.all(
      hosts.map((host) => {
        return this.dedicatedCloudDataCenterHostService
          .getHostLocation(this.productId, this.datacenterId, host.hostId)
          .then((location) => ({ ...host, location }))
          .catch(() => host);
      }),
    );
  }

  loadHosts({ offset, pageSize }) {
    return this.DedicatedCloud.getPaginatedHosts(
      this.productId,
      this.datacenterId,
      pageSize,
      offset - 1,
    ).then((result) =>
      this.chooseConsumptionFetchingMethod(result.list.results).then(
        (hostsWithConsumption) =>
          this.fetchLocations(hostsWithConsumption).then(
            (hostsWithLocation) => ({
              data: hostsWithLocation,
              meta: {
                totalCount: result.count,
              },
            }),
          ),
      ),
    );
  }
}
