export default class OctaviaLoadBalancerPoolsDetailMemberEditNameCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerMembersService, Alerter, $translate) {
    this.OctaviaLoadBalancerMembersService = OctaviaLoadBalancerMembersService;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.isLoading = false;
  }

  cancel() {
    this.trackEditMemberAction('cancel');
    this.goBack();
  }

  update() {
    this.trackEditMemberAction('confirm');
    this.isLoading = true;
    this.OctaviaLoadBalancerMembersService.updateMemberName(
      this.projectId,
      this.region,
      this.poolId,
      this.memberId,
      this.memberName,
    )
      .then(() => {
        this.trackEditMemberPage('success');
        this.Alerter.set(
          'alert-success',
          this.$translate.instant(
            'octavia_load_balancer_pools_detail_members_edit_name_success',
          ),
          null,
          'octavia.alerts.members',
        );
        this.goBack(true);
      })
      .catch((error) => {
        this.trackEditMemberPage('error');
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
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
