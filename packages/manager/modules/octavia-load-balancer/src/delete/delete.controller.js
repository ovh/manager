export default class OctaviaLoadBalancerDeleteCtrl {
  /* @ngInject */
  constructor(
    atInternet,
    $http,
    Alerter,
    $translate,
    OctaviaLoadBalancerService,
  ) {
    this.isLoading = false;
    this.atInternet = atInternet;
    this.$http = $http;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.OctaviaLoadBalancerService = OctaviaLoadBalancerService;
  }

  cancel() {
    this.trackDeletionAction('cancel');
    this.goBack();
  }

  delete() {
    this.isLoading = true;
    this.trackDeletionAction('confirm');
    this.OctaviaLoadBalancerService.deleteLoadBalancer(
      this.projectId,
      this.loadBalancerRegion,
      this.loadBalancerId,
    )
      .then(() => {
        this.trackDeletionPage('success');
        this.Alerter.set(
          'alert-info',
          this.$translate.instant('octavia_load_balancer_delete_success'),
          null,
          'octavia.alerts.global',
        );
        this.goBack(true);
      })
      .catch((error) => {
        this.trackDeletionPage('error');
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data.message,
            requestId: error.config.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'octavia.alerts.global',
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
