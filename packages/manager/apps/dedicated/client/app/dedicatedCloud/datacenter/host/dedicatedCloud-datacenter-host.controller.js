import get from 'lodash/get';

import {
  RESOURCE_BILLING_TYPES,
  RESOURCE_UPGRADE_TYPES,
} from '../../resource/upgrade/upgrade.constants';

angular.module('App').controller(
  'DedicatedCloudSubDatacentersHostCtrl',
  class {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $state,
      $stateParams,
      currentService,
      DedicatedCloud,
      dedicatedCloudDataCenterHostService,
      ovhManagerPccDatacenterService,
      DEDICATED_CLOUD_DATACENTER,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.currentService = currentService;
      this.DedicatedCloud = DedicatedCloud;
      this.dedicatedCloudDataCenterHostService = dedicatedCloudDataCenterHostService;
      this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
      this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
    }

    $onInit() {
      this.RESOURCE_BILLING_TYPES = RESOURCE_BILLING_TYPES;
      this.RESOURCE_UPGRADE_TYPES = RESOURCE_UPGRADE_TYPES;

      return this.fetchDatacenterInfoProxy();
    }

    fetchDatacenterInfoProxy() {
      this.loading = true;

      return this.DedicatedCloud.getDatacenterInfoProxy(
        this.$stateParams.productId,
        this.$stateParams.datacenterId,
      )
        .then(({ commercialRangeName }) => {
          this.$scope.datacenter.model.commercialRangeName = commercialRangeName;
        })
        .finally(() => {
          this.loading = false;
        });
    }

    fetchLegacyHostConsumption(hosts) {
      return this.$q.all(
        hosts.map((host) =>
          host.billingType === this.RESOURCE_BILLING_TYPES.hourly
            ? this.dedicatedCloudDataCenterHostService
                .getHostHourlyConsumption(
                  this.$stateParams.productId,
                  this.$stateParams.datacenterId,
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
      return !this.currentService.usesLegacyOrder
        ? this.ovhManagerPccDatacenterService
            .fetchConsumptionForService(
              this.currentService.serviceInfos.serviceId,
            )
            .then(this.fetchConsumptionForHosts(hosts))
        : this.fetchLegacyHostConsumption(hosts);
    }

    loadHosts({ offset, pageSize }) {
      return this.DedicatedCloud.getPaginatedHosts(
        this.$stateParams.productId,
        this.$stateParams.datacenterId,
        pageSize,
        offset - 1,
      ).then((result) =>
        this.chooseConsumptionFetchingMethod(result.list.results).then(
          (hostsWithConsumption) => ({
            data: hostsWithConsumption,
            meta: {
              totalCount: result.count,
            },
          }),
        ),
      );
    }

    orderHost(datacenter) {
      if (!this.currentService.usesLegacyOrder) {
        this.$state.go('app.dedicatedClouds.datacenter.hosts.order');
      } else {
        this.$scope.setAction(
          'datacenter/host/orderLegacy/dedicatedCloud-datacenter-host-orderLegacy',
          datacenter.model,
          true,
        );
      }
    }
  },
);
