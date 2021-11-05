import { MAXIMUM_SNAPSHOT_ALLOWED } from './constants';

export default class NetAppVolumesDashboardSnapshotsController {
  /* @ngInject */
  constructor(Alerter, $translate) {
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.MAXIMUM_SNAPSHOT_ALLOWED = MAXIMUM_SNAPSHOT_ALLOWED;
  }

  $onInit() {
    this.policyId = this.currentPolicy.id;
  }

  changePolicy() {
    return this.applyPolicy(this.policyId)
      .then(() =>
        this.Alerter.success(
          this.$translate.instant(
            'netapp_volumes_snapshots_policies_apply_success',
          ),
        ),
      )
      .catch((error) =>
        this.Alerter.error(
          `${this.$translate.instant(
            'netapp_volumes_snapshots_policies_apply_error',
          )} ${error.message}`,
        ),
      );
  }
}
