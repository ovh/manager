export default class HostingTerminateCdnCtrl {
  /* @ngInject */
  constructor($translate, Hosting, Alerter) {
    this.$translate = $translate;
    this.Hosting = Hosting;
    this.Alerter = Alerter;
  }

  onTerminateCdn() {
    this.trackClick('confirm');

    this.isBeingTerminated = true;
    this.Hosting.updateServiceInfo(this.serviceName, {
      deleteAtExpiration: true,
    })
      .then(() => this.goBack())
      .then(() => {
        return this.Alerter.success(
          this.$translate.instant('hosting_cdn_terminate_success'),
          this.alerts.main,
        );
      })
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_cdn_terminate_error'),
          error.data?.message || error,
          this.alerts.main,
        );
      })
      .finally(() => {
        this.isBeingTerminated = false;
      });
  }

  onTerminationCancel() {
    this.trackClick('cancel');
    this.goBack();
  }
}
