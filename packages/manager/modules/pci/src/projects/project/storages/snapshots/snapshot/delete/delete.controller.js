import get from 'lodash/get';

export default class PciSnapshotsSnapshotDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectStorageSnapshotsService,
  ) {
    this.$translate = $translate;
    this.PciProjectStorageSnapshotsService = PciProjectStorageSnapshotsService;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteSnapshot() {
    this.isLoading = true;
    return this.PciProjectStorageSnapshotsService.delete(this.projectId, this.snapshot)
      .then(() => this.goBack(this.$translate.instant(
        'pci_projects_project_storages_snapshots_snapshot_delete_success_message',
        {
          snapshot: this.snapshot.name,
        },
      )))
      .catch((err) => this.goBack(this.$translate.instant(
        'pci_projects_project_storages_snapshots_snapshot_delete_error_delete',
        {
          message: get(err, 'data.message', null),
          snapshot: this.snapshot.name,
        },
      ), 'error'))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
