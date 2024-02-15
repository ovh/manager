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
    this.OctaviaLoadBalancerMembersService.createMembers(
      this.projectId,
      this.region,
      this.poolId,
      [
        {
          address: this.addressIp,
          name: this.name,
          protocolPort: this.port,
        },
      ],
    )
      .then(async () => {
        this.trackCreatePage('success');
        this.goBack(true).then(() =>
          this.Alerter.set(
            'alert-success',
            this.$translate.instant(
              'octavia_load_balancer_pools_detail_members_create_success',
            ),
            null,
            'octavia.alerts.members',
          ),
        );
      })
      .catch((error) => {
        this.trackCreatePage('error');
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
