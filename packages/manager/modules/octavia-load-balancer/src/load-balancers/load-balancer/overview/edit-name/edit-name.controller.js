import { LOAD_BALANCER_NAME_REGEX } from '../../../../create/constants';

export default class OctaviaLoadBalancerEditNameCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerService, Alerter, $translate) {
    this.isLoading = false;
    this.OctaviaLoadBalancerService = OctaviaLoadBalancerService;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.loadBalancerNameRegex = LOAD_BALANCER_NAME_REGEX;
  }

  $onInit() {
    this.name = this.loadbalancer.name;
  }

  cancel() {
    this.trackAction('cancel');
    this.goBack();
  }

  update() {
    this.trackAction('confirm');
    this.isLoading = true;
    this.OctaviaLoadBalancerService.updateName(
      this.projectId,
      this.region,
      this.loadbalancer.id,
      this.name,
    )
      .then(() => {
        this.trackPage('success');
        return this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant('octavia_load_balancer_edit_name_success'),
            null,
            'octavia.alerts.loadbalancer',
          ),
        );
      })
      .catch((error) => {
        this.trackPage('error');
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'octavia.alerts.loadbalancer',
        );
        return this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
