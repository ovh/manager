import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

export default class PciBlockStorageDetailsAttachController {
  /* @ngInject */
  constructor($translate, PciProjectStorageBlockService) {
    this.$translate = $translate;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.isLoading = false;

    this.instancesList = map(this.instances, ({ id, name }) => ({ id, name }));
  }

  attachStorage({ id, name: instanceName }) {
    this.isLoading = true;
    const instance = find(this.instances, { id });

    return this.PciProjectStorageBlockService.attachTo(
      this.projectId,
      this.storage,
      instance,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_attach_success_message',
            {
              volume: this.storage.name,
              instance: instanceName,
              volumeId: this.storage.id,
              instanceId: id,
              type: this.storage.type,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_attach_error_attach',
            {
              message: get(err, 'data.message', null),
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
