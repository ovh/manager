import { REGEX } from '../../../../constants';

export default class OctaviaLoadBalancerPoolsDetailMembersCreateCtrl {
  /* @ngInject */

  constructor(Alerter, OctaviaLoadBalancerMembersService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerMembersService = OctaviaLoadBalancerMembersService;
    this.$translate = $translate;
    this.REGEX = REGEX;
  }

  addMember() {
    this.isLoading = true;
    this.trackCreateAction('confirm');
    this.OctaviaLoadBalancerMembersService.createPoolMember(
      this.projectId,
      this.region,
      this.poolId,
      this.addressIp,
      this.name,
      this.port,
    )
      .then(async () => {
        this.Alerter.set(
          'alert-success',
          this.$translate.instant(
            'octavia_load_balancer_pools_detail_members_create_success',
          ),
          null,
          'octavia.alerts.members',
        );
        this.goBack(true);
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'octavia.alerts.members',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackCreateAction('cancel');
    this.goBack();
  }
}
