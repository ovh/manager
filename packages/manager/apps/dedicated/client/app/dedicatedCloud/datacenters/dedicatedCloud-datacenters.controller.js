import get from 'lodash/get';

angular.module('App').controller(
  'DedicatedCloudDatacentersCtrl',
  class DedicatedCloudDatacentersController {
    constructor(
      $q,
      $scope,
      $state,
      $stateParams,
      currentService,
      DedicatedCloud,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.currentService = currentService;
      this.DedicatedCloud = DedicatedCloud;
    }

    getDatacenterLink({ name: datacenterId }) {
      return this.$state.href('app.dedicatedClouds.datacenter', {
        datacenterId,
      });
    }

    loadDatacenters({ offset, pageSize }) {
      return this.DedicatedCloud.getDatacentersInformations(
        this.$stateParams.productId,
        pageSize,
        offset - 1,
      )
        .then((result) => ({
          data: get(result, 'list.results'),
          meta: {
            totalCount: result.count,
          },
        }))
        .catch((err) => {
          this.$scope.resetAction();
          this.$scope.setMessage(
            this.$translate.instant('dedicatedCloud_datacenters_loading_error'),
            {
              message: err.message,
              type: 'ERROR',
            },
          );
          return this.$q.reject(err);
        })
        .finally(() => {
          this.$scope.loading = false;
        });
    }

    orderDatastore(datacenter) {
      if (!this.currentService.usesLegacyOrder) {
        this.$state.go('app.dedicatedClouds.datacenter.datastores.order', {
          datacenterId: datacenter.id,
        });
      } else {
        this.$scope.setAction(
          'datacenter/datastore/orderLegacy/dedicatedCloud-datacenter-datastore-orderLegacy',
          datacenter,
          true,
        );
      }
    }

    orderHost(datacenter) {
      if (!this.currentService.usesLegacyOrder) {
        this.$state.go('app.dedicatedClouds.datacenter.hosts.order', {
          datacenterId: datacenter.id,
        });
      } else {
        this.$scope.setAction(
          'datacenter/host/orderLegacy/dedicatedCloud-datacenter-host-orderLegacy',
          datacenter,
          true,
        );
      }
    }
  },
);
