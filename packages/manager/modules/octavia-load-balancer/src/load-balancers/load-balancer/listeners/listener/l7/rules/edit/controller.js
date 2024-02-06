export default class OctaviaLoadBalancerEditL7RuleCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerL7Service, Alerter, $translate) {
    this.OctaviaLoadBalancerL7Service = OctaviaLoadBalancerL7Service;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;
    this.model = this.rule;
  }

  submit() {
    this.loading = true;
    this.trackL7EditRuleAction('confirm');
    this.OctaviaLoadBalancerL7Service.updateRule(
      this.projectId,
      this.region,
      this.policyId,
      this.model,
    )
      .then(() => {
        this.trackL7EditRulePage('success');
        return this.goBackToL7RulesList(true);
      })
      .then(() =>
        this.Alerter.set(
          'alert-success',
          this.$translate.instant('octavia_load_balancer_edit_l7_rule_success'),
          null,
          'octavia.alerts.l7Rules',
        ),
      )
      .catch((error) => {
        this.trackL7EditRulePage('error');
        this.displayErrorAlert(error, 'octavia.alerts.l7Rules');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.trackL7EditRuleAction('cancel');
    this.goBackToL7RulesList();
  }
}
