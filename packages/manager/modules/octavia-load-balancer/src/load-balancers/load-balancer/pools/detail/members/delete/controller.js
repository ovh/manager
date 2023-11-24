export default class OctaviaLoadBalancerPoolMemberDeleteCtrl {
  /* @ngInject */
  constructor(Alerter, $translate, OctaviaLoadBalancerMembersService) {
    this.isLoading = false;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.OctaviaLoadBalancerMembersService = OctaviaLoadBalancerMembersService;
  }

  cancel() {
    this.trackDeleteAction(`cancel`);
    this.goBack();
  }

  delete() {
    this.isLoading = true;
    this.trackDeleteAction(`confirm`);
    this.OctaviaLoadBalancerMembersService.deleteMember(
      this.projectId,
      this.region,
      this.poolId,
      this.memberId,
    )
      .then(() => {
        this.trackDeletePage(`success`);
        this.Alerter.set(
          'alert-success',
          this.$translate.instant(
            'octavia_load_balancer_pools_detail_members_delete_success',
            { member: this.memberName },
          ),
          null,
          'octavia.alerts.members',
        );
        this.goBack(true);
      })
      .catch((error) => {
        this.trackDeletePage(`error`);
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data.message,
            requestId: error.headers('X-Ovh-Queryid'),
          }),
          'octavia.alerts.members',
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
