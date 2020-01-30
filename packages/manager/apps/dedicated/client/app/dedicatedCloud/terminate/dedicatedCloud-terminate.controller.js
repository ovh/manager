angular.module('App').controller(
  'DedicatedCloudTerminateCtrl',
  class DedicatedCloudTerminateCtrl {
    constructor(
      $state,
      $stateParams,
      $translate,
      OvhApiDedicatedCloud,
      Alerter,
    ) {
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
      this.Alerter = Alerter;

      this.loading = {
        terminate: false,
      };
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    onTerminateBtnClick() {
      this.loading.terminate = true;

      return this.OvhApiDedicatedCloud.v6()
        .terminate({
          serviceName: this.$stateParams.productId,
        })
        .$promise.then(() =>
          this.Alerter.success(
            this.$translate.instant('dedicatedCloud_close_service_success'),
          ),
        )
        .catch((error) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('dedicatedCloud_close_service_error'),
            error,
          ),
        )
        .finally(() => {
          this.loading.terminate = false;
          this.onCancelBtnClick();
        });
    }

    onCancelBtnClick() {
      this.$state.go('^');
    }

    /* -----  End of EVENTS  ------ */
  },
);
