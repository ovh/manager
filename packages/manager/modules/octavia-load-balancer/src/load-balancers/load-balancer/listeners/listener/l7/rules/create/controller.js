export default class OctaviaLoadBalancerCreateL7RuleCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerL7Service, Alerter, $translate) {
    this.OctaviaLoadBalancerL7Service = OctaviaLoadBalancerL7Service;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;
    this.model = {
      ruleType: undefined,
      compareType: undefined,
      key: '',
      value: '',
      invert: false,
    };
  }

  submit() {
    this.loading = true;
    this.trackL7CreateRuleAction('confirm');
    this.OctaviaLoadBalancerL7Service.createRule(
      this.projectId,
      this.region,
      this.policyId,
      this.model,
    )
      .then(() => {
        this.trackL7CreateRulePage('success');
        this.goBackToL7RulesList(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_create_l7_rule_success',
            ),
            null,
            'octavia.alerts.l7Rules',
          ),
        );
      })
      .catch((error) => {
        this.trackL7CreateRulePage('error');
        this.displayErrorAlert(error, 'octavia.alerts.l7Rules');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.trackL7CreateRuleAction('cancel');
    this.goBackToL7RulesList();
  }
}
