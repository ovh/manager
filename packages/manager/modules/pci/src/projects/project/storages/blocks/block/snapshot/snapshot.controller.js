import get from 'lodash/get';

export default class PciBlockStorageDetailchsSnapshotController {
  /* @ngInject */
  constructor(
    $filter,
    $translate,
    PciProjectStorageBlockService,
  ) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.snapshot = {};
    this.isLoading = false;

    this.snapshot.name = `${this.storage.name} ${this.$filter('date')(new Date(), 'short')}`;
  }

  createSnapshot() {
    this.isLoading = true;
    return this.PciProjectStorageBlockService
      .createSnapshot(this.projectId, this.storage, this.snapshot)
      .then(() => this.goBack(this.$translate.instant(
        'pci_projects_project_storages_blocks_block_snapshot_success_message',
        {
          snapshot: this.snapshot.name,
        },
      )))
      .catch(err => this.goBack(this.$translate.instant(
        'pci_projects_project_storages_blocks_block_snapshot_error_delete',
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
