export default class DedicatedCloudTerminateCtrl {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $state,
    $stateParams,
    $translate,
    OvhApiDedicatedCloud,
    Alerter,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.Alerter = Alerter;

    this.loading = {
      terminate: false,
    };
  }

  $onInit() {
    this.TERMINATE_OPTIONS = [
      'terminate',
      this.serviceInfos.renew.deleteAtExpiration
        ? 'cancel'
        : 'delete_at_expiration',
    ].map((type) => ({
      type,
      // Use existing loaded translations while waiting for translation request
      label: this.$translate.instant(
        `server_close_service_form_option_${type}`,
      ),
    }));
    this.model = {
      termination: !this.canDeleteAtExpiration ? { type: 'terminate' } : null,
    };
  }

  /* =============================
    =            EVENTS            =
    ============================== */

  onTerminateBtnClick() {
    this.loading.terminate = true;
    let promise = this.$q.when(true);
    switch (this.model.termination.type) {
      case 'terminate':
        promise = this.OvhApiDedicatedCloud.v6()
          .terminate({
            serviceName: this.serviceName,
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
          );
        break;
      case 'delete_at_expiration':
        promise = this.$http
          .put(`/dedicatedCloud/${this.serviceName}/serviceInfos`, {
            renew: {
              ...this.serviceInfos.renew,
              automatic: true,
              deleteAtExpiration: true,
            },
          })
          .then(() =>
            this.Alerter.success(
              this.$translate.instant(
                'server_close_service_delete_at_expiration_activate_success',
              ),
            ),
          )
          .catch((err) => {
            this.Alerter.alertFromSWS(
              this.$translate.instant(
                'server_close_service_delete_at_expiration_activate_error',
              ),
              err,
            );
            return this.$q.reject(err);
          });
        break;
      case 'cancel':
        promise = this.$http
          .put(`/dedicatedCloud/${this.serviceName}/serviceInfos`, {
            renew: {
              ...this.serviceInfos.renew,
              automatic: true,
              deleteAtExpiration: false,
            },
          })
          .then(() =>
            this.Alerter.success(
              this.$translate.instant('server_close_service_cancel_success'),
            ),
          )
          .catch((err) => {
            this.Alerter.alertFromSWS(
              this.$translate.instant('server_close_service_cancel_error'),
              err,
            );
            return this.$q.reject(err);
          });
        break;
      default:
        break;
    }

    return promise.finally(() => {
      this.loading.terminate = false;
      this.onCancelBtnClick();
    });
  }

  onCancelBtnClick() {
    this.$state.go('^');
  }

  /* -----  End of EVENTS  ------ */
}
