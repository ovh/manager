import { MAXIMUM_SNAPSHOT_ALLOWED, SNAPSHOT_TYPE } from './constants';

export default class NetAppVolumesDashboardSnapshotsController {
  /* @ngInject */
  constructor(Alerter, $translate, atInternet, NetAppSnapshotService) {
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.MAXIMUM_SNAPSHOT_ALLOWED = MAXIMUM_SNAPSHOT_ALLOWED;
    this.SNAPSHOT_TYPE = SNAPSHOT_TYPE;
    this.NetAppSnapshotService = NetAppSnapshotService;
    this.loadingSnapshotHold = false;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.policyId = this.currentPolicy.id;
    this.SNAPSHOT_TYPE = SNAPSHOT_TYPE;
  }

  isApplicablePolicy() {
    return (
      this.snapshotPolicies.length === 1 && !this.snapshotPolicies[0].isDefault
    );
  }

  changePolicy() {
    this.trackClick('apply-policy');
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

  holdSnapshot(snapshotId) {
    this.trackClick('hold');
    this.loadingSnapshotHold = true;
    this.Alerter.set(
      'alert-info',
      this.$translate.instant('netapp_volumes_snapshots_hold_action_doing'),
    );
    this.NetAppSnapshotService.holdSnapshot(
      this.serviceName,
      this.volumeId,
      snapshotId,
    )
      .then(() =>
        this.goToSnapshots(
          this.$translate.instant(
            'netapp_volumes_snapshots_hold_action_success',
          ),
        ),
      )
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant(
            'netapp_volumes_snapshots_hold_action_error',
            {
              message: error.data?.message,
              requestId: error.headers?.('X-Ovh-Queryid') || null,
            },
          ),
        ),
      )
      .finally(() => {
        this.loadingSnapshotHold = false;
      });
  }
}
