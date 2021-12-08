export default class HostingTerminateCdnCtrl {
  /* @ngInject */
  constructor($translate, Hosting, Alerter) {
    this.$translate = $translate;
    this.Hosting = Hosting;
    this.Alerter = Alerter;
  }

  onCancelTerminateCdn() {
    this.trackClick('confirm');

    this.isBeingCancelTerminated = true;
    this.Hosting.updateServiceInfo(this.serviceName, {
      deleteAtExpiration: false,
    })
      .then(() => this.goBack())
      .then(() => {
        return this.Alerter.success(
          this.$translate.instant('hosting_cdn_cancel_terminate_success'),
          this.alerts.main,
        );
      })
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_cdn_cancel_terminate_error'),
          error.data?.message || error,
          this.alerts.main,
        );
      })
      .finally(() => {
        this.isBeingCancelTerminated = false;
      });
  }

  onTerminationCancel() {
    this.trackClick('cancel');
    this.goBack();
  }
}
