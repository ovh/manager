import get from 'lodash/get';

export default class PciBlockStorageDetailsDetachController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectStorageBlockService,
  ) {
    this.$translate = $translate;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.isLoading = false;
  }

  detachStorage() {
    this.isLoading = true;
    return this.PciProjectStorageBlockService
      .detach(this.projectId, this.storage)
      .then(() => this.goBack(this.$translate.instant(
        'pci_projects_project_storages_blocks_block_detach_success_message',
        {
          volume: this.storage.name,
        },
      )))
      .catch((err) => this.goBack(this.$translate.instant(
        'pci_projects_project_storages_blocks_block_detach_error_detach',
        {
          message: get(err, 'data.message', null),
          volume: this.storage.name,
        },
      ), 'error'))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
