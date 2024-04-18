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
      name: '',
      position: 1,
      action: undefined,
      redirectHttpCode: undefined,
      redirectPoolId: undefined,
      redirectPrefix: undefined,
      redirectUrl: undefined,
    };
  }

  submit() {
    this.loading = true;
    this.trackL7CreatePolicyAction('confirm');
    this.OctaviaLoadBalancerL7Service.createL7Policy(
      this.projectId,
      this.region,
      this.listenerId,
      this.model,
    )
      .then(({ data: { id } }) => {
        this.trackL7CreatePolicyPage('success');
        return this.goBackToL7PoliciesList(true).then(() => id);
      })
      .then((id) =>
        this.Alerter.set(
          'alert-success',
          this.$translate.instant(
            'octavia_load_balancer_create_l7_policy_success',
            {
              policy: this.model.name,
              link: this.getL7RuleCreationLink(id),
            },
          ),
          null,
          'octavia.alerts.l7Policies',
        ),
      )
      .catch((error) => {
        this.trackL7CreatePolicyPage('error');
        this.displayErrorAlert(error, 'octavia.alerts.l7Policy.create');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.trackL7CreatePolicyAction('cancel');
    this.goBackToL7PoliciesList();
  }
}
