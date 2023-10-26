export default class OctaviaLoadBalancerEditNameCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerService, Alerter, $translate) {
    this.isLoading = false;
    this.OctaviaLoadBalancerService = OctaviaLoadBalancerService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.name = this.loadbalancer.name;
  }

  cancel() {
    this.trackCancel();
    this.goBack();
  }

  update() {
    this.trackConfirm();
    this.isLoading = true;
    this.OctaviaLoadBalancerService.updateName(
      this.projectId,
      this.region,
      this.loadbalancer.id,
      this.name,
    )
      .then(() => {
        this.trackSuccess();
        this.Alerter.set(
          'alert-success',
          this.$translate.instant('octavia_load_balancer_edit_name_success'),
          null,
          'octavia.alerts.global',
        );
        this.goBack(true);
      })
      .catch((error) => {
        this.trackFailure();
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
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
