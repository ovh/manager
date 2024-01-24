export default class OctaviaLoadBalancerCreateL7PolicyCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerL7Service, Alerter, $translate) {
    this.OctaviaLoadBalancerL7Service = OctaviaLoadBalancerL7Service;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.loading = false;
    this.model = {
      name: this.policy.name,
      position: this.policy.position,
      action: this.policy.action,
      redirectHttpCode: this.policy.redirectHttpCode,
      redirectPoolId: this.policy.redirectPoolId,
      redirectPrefix: this.policy.redirectPrefix,
      redirectUrl: this.policy.redirectUrl,
    };
  }

  submit() {
    this.loading = true;
    this.trackL7EditPolicyAction('confirm');
    this.OctaviaLoadBalancerL7Service.updatePolicy(
      this.projectId,
      this.region,
      this.policy.id,
      this.model,
    )
      .then(async (response) => {
        this.trackL7EditPolicyPage('success');
        await this.goBackToL7PoliciesList(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_edit_l7_policy_success',
              {
                policy: this.model.name,
                link: this.getL7RuleCreationLink(response),
              },
            ),
            null,
            'octavia.alerts.l7Policies',
          ),
        );
      })
      .catch((error) => {
        this.trackL7EditPolicyPage('error');
        this.displayErrorAlert(error, 'octavia.alerts.l7Policy.edit');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.trackL7EditPolicyAction('cancel');
    this.goBackToL7PoliciesList();
  }
}
