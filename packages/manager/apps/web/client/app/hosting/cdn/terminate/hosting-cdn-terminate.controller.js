export default class HostingTerminateCdnCtrl {
  /* @ngInject */
  constructor($filter, $translate, Hosting, Alerter) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.Hosting = Hosting;
    this.Alerter = Alerter;
  }

  onTerminateCdn() {
    this.trackClick('confirm');

    this.isBeingTerminated = true;
    return this.Hosting.updateServiceInfo(this.serviceName, {
      deleteAtExpiration: true,
      automatic: true,
      forced: false,
    })
      .then(() =>
        this.goBack(
          this.$translate.instant('hosting_cdn_terminate_success', {
            endEngagementDate: this.$filter('date')(
              this.cdnServiceInfo.expirationDate,
            ),
          }),
        ),
      )
      .catch((error) => {
        return this.goBack().then(() =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_cdn_terminate_error', {
              message: error.data?.message || error,
            }),
            this.alerts.main,
          ),
        );
      })
      .finally(() => {
        this.isBeingTerminated = false;
      });
  }

  onTerminationCancel() {
    this.trackClick('cancel');

    return this.goBack();
  }
}
