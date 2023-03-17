import get from 'lodash/get';
import { VOLUME_BLOCK_TRACKING } from '../../block.constants';

export default class PciBlockStorageDetailsDetachController {
  /* @ngInject */
  constructor($translate, PciProjectStorageBlockService) {
    this.$translate = $translate;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.isLoading = false;
  }

  onDetachStorageClick() {
    this.trackClick(VOLUME_BLOCK_TRACKING.DETACH_VOLUME.CTA_CONFIRM);

    this.isLoading = true;
    return this.PciProjectStorageBlockService.detach(
      this.projectId,
      this.storage,
    )
      .then(() => {
        this.trackPage(VOLUME_BLOCK_TRACKING.DETACH_VOLUME.REQUEST_SUCCESS);

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_detach_success_message',
            {
              volume: this.storage.name,
            },
          ),
        );
      })
      .catch((err) => {
        this.trackPage(VOLUME_BLOCK_TRACKING.DETACH_VOLUME.REQUEST_FAIL);

        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_detach_error_detach',
            {
              message: get(err, 'data.message', null),
              volume: this.storage.name,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onDetachStorageCancelClick() {
    this.trackClick(VOLUME_BLOCK_TRACKING.DETACH_VOLUME.CTA_CANCEL);

    return this.goBack();
  }
}
