angular.module('App').controller(
  'ovhManagerPccDatacenterBackupEnableLegacy',
  class {
    /* @ngInject */
    constructor($q, $stateParams, $state, $translate, Alerter, DedicatedCloud) {
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      this.loading = {
        init: false,
        enable: false,
      };

      this.datacenter = null;
      this.hosts = null;

      return this.fetchInitialData();
    }

    fetchInitialData() {
      this.loading.init = true;

      return this.$q
        .all({
          datacenter: this.DedicatedCloud.getDatacenterInfoProxy(
            this.$stateParams.productId,
            this.$stateParams.datacenterId,
          ),
          hosts: this.DedicatedCloud.getHosts(
            this.$stateParams.productId,
            this.$stateParams.datacenterId,
          ),
        })
        .then(({ datacenter, hosts }) => {
          this.datacenter = datacenter;
          this.hosts = hosts;
        })
        .finally(() => {
          this.loading.init = false;
        });
    }

    onConfirmBtnClick() {
      if (!this.hosts.length) {
        return this.onCancelBtnClick();
      }

      this.loading.enable = true;

      return this.DedicatedCloud.enableVeeam(
        this.$stateParams.productId,
        this.$stateParams.datacenterId,
      )
        .then(() => {
          this.Alerter.success(
            this.$translate.instant('dedicatedCloud_tab_veeam_enable_success', {
              t0: this.datacenter.name,
            }),
            'dedicatedCloudDatacenterAlert',
          );
        })
        .catch((error) => {
          this.Alerter.error(
            this.$translate.instant('dedicatedCloud_tab_veeam_enable_fail', {
              t0: this.datacenter.name,
            }),
            error,
            'dedicatedCloudDatacenterAlert',
          );
        })
        .finally(() => {
          this.loading.enable = false;
          this.onCancelBtnClick();
        });
    }

    onCancelBtnClick() {
      return this.$state.go('^');
    }
  },
);
