export default class DedicatedCloudTerminateCtrl {
  /* @ngInject */
  constructor($http, $q, $translate, OvhApiDedicatedCloud) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;

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
    switch (this.model.termination.type) {
      case 'terminate':
        return this.OvhApiDedicatedCloud.v6()
          .terminate({
            serviceName: this.serviceName,
          })
          .$promise.then(() =>
            this.goBack(
              this.$translate.instant('dedicatedCloud_close_service_success'),
            ),
          )
          .catch((error) =>
            this.goBack(
              `${this.$translate.instant(
                'dedicatedCloud_close_service_error',
              )} ${error.message || error}`,
              'danger',
            ),
          );
      case 'delete_at_expiration':
        return this.$http
          .put(`/dedicatedCloud/${this.serviceName}/serviceInfos`, {
            renew: {
              ...this.serviceInfos.renew,
              automatic: true,
              deleteAtExpiration: true,
            },
          })
          .then(() =>
            this.goBack(
              this.$translate.instant(
                'server_close_service_delete_at_expiration_activate_success',
              ),
            ),
          )
          .catch((err) =>
            this.goBack(
              `${this.$translate.instant(
                'server_close_service_delete_at_expiration_activate_error',
              )} ${err.message || err}`,
              'danger',
            ),
          );
      case 'cancel':
        return this.$http
          .put(`/dedicatedCloud/${this.serviceName}/serviceInfos`, {
            renew: {
              ...this.serviceInfos.renew,
              automatic: true,
              deleteAtExpiration: false,
            },
          })
          .then(() =>
            this.goBack(
              this.$translate.instant('server_close_service_cancel_success'),
            ),
          )
          .catch((err) =>
            this.goBack(
              `${this.$translate.instant(
                'server_close_service_cancel_error',
              )} ${err.message || err}`,
              'danger',
            ),
          );
      default:
        return this.$q.when();
    }
  }

  /* -----  End of EVENTS  ------ */
}
