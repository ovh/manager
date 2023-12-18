import get from 'lodash/get';

export default class PciBlockStorageDetailsDeleteController {
  /* @ngInject */
  constructor($translate, PciProjectStorageBlockService) {
    this.$translate = $translate;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteStorage() {
    this.isLoading = true;
    return this.PciProjectStorageBlockService.delete(
      this.projectId,
      this.storage,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_delete_success_message',
            {
              volume: this.storage.name,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_delete_error_delete',
            {
              message: get(err, 'data.message', null),
              volume: this.storage.name,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
