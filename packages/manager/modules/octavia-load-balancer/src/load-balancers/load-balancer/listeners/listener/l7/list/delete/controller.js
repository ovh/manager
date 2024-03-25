export default class OctaviaLoadBalancerDeleteL7PolicyCtrl {
  /* @ngInject */
  constructor(Alerter, $translate, OctaviaLoadBalancerL7Service) {
    this.isLoading = false;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.OctaviaLoadBalancerL7Service = OctaviaLoadBalancerL7Service;
  }

  cancel() {
    this.trackL7PolicyDeleteAction(`cancel`);
    this.goBack();
  }

  delete() {
    this.isLoading = true;
    this.trackL7PolicyDeleteAction(`confirm`);
    this.OctaviaLoadBalancerL7Service.deletePolicy(
      this.projectId,
      this.region,
      this.policyId,
    )
      .then(() => {
        this.trackL7PolicyDeletePage(`success`);
        return this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_list_l7_policies_delete_success',
              { policy: this.policyName },
            ),
            null,
            'octavia.alerts.l7Policies',
          ),
        );
      })
      .catch((error) => {
        this.trackL7PolicyDeletePage(`error`);
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data.message,
            requestId: error.config.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'octavia.alerts.l7Policies',
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
