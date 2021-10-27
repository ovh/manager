export default class OvhManagerNetAppSnapshotPoliciesCtrl {
  /* @ngInject */
  constructor($http, $q, $translate, Alerter) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  onDelete(snapshotPolicy) {
    this.isDeleting = true;

    return this.$http
      .delete(
        `/storage/netapp/${this.serviceName}/snapshotPolicy/${snapshotPolicy.id}`,
      )
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('netapp_snapshot_policies_delete_success', {
            snapshotPolicyName:
              snapshotPolicy.name ||
              snapshotPolicy.description ||
              snapshotPolicy.id,
          }),
        );

        return this.fetchSnapshotPolicies();
      })
      .catch((error) => {
        this.Alerter.error(
          `${this.$translate.instant(
            'netapp_snapshot_policies_delete_error',
          )} ${error?.data?.message || error.message}`,
        );

        return this.$q.when();
      })
      .finally(() => {
        this.isDeleting = false;
      });
  }

  fetchSnapshotPolicies() {
    return this.getSnapshotPolicies()
      .then((snapshotPolicies) => {
        this.snapshotPolicies = snapshotPolicies;
      })
      .catch((error) => {
        this.Alerter.error(
          `${this.$translate.instant(
            'netapp_snapshot_policies_fetch_error',
          )} ${error?.data?.message || error.message}`,
        );
      });
  }
}
