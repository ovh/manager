export default class OctaviaLoadBalancerDeleteL7PolicyCtrl {
  /* @ngInject */
  constructor(Alerter, $translate, OctaviaLoadBalancerL7Service) {
    this.isLoading = false;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.OctaviaLoadBalancerL7Service = OctaviaLoadBalancerL7Service;
  }

  cancel() {
    this.trackL7RuleDeleteAction(`cancel`);
    this.goBack();
  }

  delete() {
    this.isLoading = true;
    this.trackL7RuleDeleteAction(`confirm`);
    this.OctaviaLoadBalancerL7Service.deleteRule(
      this.projectId,
      this.region,
      this.policyId,
      this.ruleId,
    )
      .then(() => {
        this.trackL7RuleDeletePage(`success`);
        return this.goBack(true);
      })
      .then(() =>
        this.Alerter.set(
          'alert-success',
          this.$translate.instant(
            'octavia_load_balancer_list_l7_rules_delete_success',
          ),
          null,
          'octavia.alerts.l7Rules',
        ),
      )
      .catch((error) => {
        this.trackL7RuleDeletePage(`error`);
        this.displayErrorAlert(error, 'octavia.alerts.l7Rules');
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
