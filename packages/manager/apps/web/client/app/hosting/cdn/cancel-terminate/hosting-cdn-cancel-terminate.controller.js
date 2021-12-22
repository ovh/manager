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
    return this.Hosting.updateServiceInfo(this.serviceName, {
      deleteAtExpiration: false,
      automatic: false,
      forced: false,
    })
      .then(() => {
        return this.goBack(
          this.$translate.instant('hosting_cdn_cancel_terminate_success'),
        );
      })
      .catch((error) => {
        return this.goBack().then(() =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_cdn_cancel_terminate_error', {
              message: error.data?.message || error,
            }),
            this.alerts.main,
          ),
        );
      })
      .finally(() => {
        this.isBeingCancelTerminated = false;
      });
  }

  onTerminationCancel() {
    this.trackClick('cancel');

    return this.goBack();
  }
}
