import get from 'lodash/get';

angular.module('App').controller(
  'DedicatedCloudSubDatacenterVeeamBackupDisableCtrl',
  class {
    /* @ngInject */
    constructor($stateParams, $state, $translate, Alerter, DedicatedCloud) {
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      this.loading = {
        init: false,
        disable: false,
      };

      this.datacenter = null;

      return this.fetchDatacenterInfoProxy();
    }

    fetchDatacenterInfoProxy() {
      this.loading.disable = true;

      return this.DedicatedCloud.getDatacenterInfoProxy(
        this.$stateParams.productId,
        this.$stateParams.datacenterId,
      )
        .then((datacenter) => {
          this.datacenter = datacenter;
        })
        .finally(() => {
          this.loading.disable = false;
        });
    }

    onConfirmBtnClick() {
      this.loading.disable = true;

      return this.DedicatedCloud.disableVeeam(
        this.$stateParams.productId,
        this.$stateParams.datacenterId,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant(
              'dedicatedCloud_tab_veeam_disable_success',
              {
                t0: this.datacenter.name,
              },
            ),
            'dedicatedCloudDatacenterAlert',
          );
        })
        .catch((error) => {
          this.Alerter.error(
            `${this.$translate.instant(
              'dedicatedCloud_tab_veeam_disable_fail',
              {
                t0: this.datacenter.name,
              },
            )}: ${get(error, 'message', '')}`,
            'dedicatedCloudDatacenterAlert',
          );
        })
        .finally(() => {
          this.loading.disable = false;
          this.onCancelBtnClick();
        });
    }

    onCancelBtnClick() {
      return this.$state.go('^');
    }
  },
);
