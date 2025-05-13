import { PATTERN } from './constants';

export default class NetAppVolumesDashboardSnapshotsCreateVolumeController {
  /* @ngInject */
  constructor($http, $translate, NetAppSnapshotCreateVolumeService) {
    this.$http = $http;
    this.$translate = $translate;
    this.NetAppSnapshotCreateVolumeService = NetAppSnapshotCreateVolumeService;
    this.PATTERN = PATTERN;
  }

  $onInit() {
    this.isLoading = false;
  }

  createVolumeFromSnapshot() {
    this.isLoading = true;
    this.trackClick('create-volume::confirm');
    return this.NetAppSnapshotCreateVolumeService.createVolumeFromSnapshot(
      this.serviceName,
      this.name,
      this.description,
      this.volume.protocol,
      this.volume.size,
      this.snapshot.id,
    )
      .then(() =>
        this.goToVolumes(
          this.$translate.instant(
            'netapp_volumes_snapshots_create_volume_success',
          ),
        ),
      )
      .catch((error) =>
        this.goToSnapshots(
          this.$translate.instant(
            'netapp_volumes_snapshots_create_volume_error',
            {
              message: error.data?.message,
              requestId: error.headers('X-Ovh-Queryid'),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  goBack() {
    this.trackClick('create-volume::cancel');
    return this.goToSnapshots();
  }
}
