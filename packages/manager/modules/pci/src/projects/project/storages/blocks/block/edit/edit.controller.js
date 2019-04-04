import angular from 'angular';

import get from 'lodash/get';
import pick from 'lodash/pick';
import BlockStorage from '../../block.class';

import {
  VOLUME_MAX_SIZE,
  VOLUME_MIN_SIZE,
} from '../../block.constants';

export default class PciBlockStorageDetailsEditController {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    $timeout,
    CucCloudMessage,
    PciProjectStorageBlockService,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.$timeout = $timeout;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.size = {
      min: VOLUME_MIN_SIZE,
      max: VOLUME_MAX_SIZE,
    };
    this.initLoaders();
  }

  initLoaders() {
    this.loading = true;

    this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getStorage())
      .then(() => this.getAvailableQuota())
      .then(() => this.estimatePrice())
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_edit_error_load',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.blocks.block.edit');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.blocks.block.edit',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getStorage() {
    return this.PciProjectStorageBlockService
      .get(this.projectId, this.storageId)
      .then((storage) => {
        this.storage = storage;

        this.editStorage = new BlockStorage(
          pick(
            this.storage,
            [
              'id',
              'region',
              'type',
              'name',
              'size',
              'bootable',
              'planCode',
            ],
          ),
        );
        return this.editStorage;
      });
  }

  getAvailableQuota() {
    return this.PciProjectStorageBlockService
      .getAvailableQuota(this.projectId, this.storage)
      .then((availableQuota) => {
        this.size.min = this.storage.size;
        this.size.max = availableQuota;
      });
  }

  estimatePrice() {
    // Wait the next digest because oui-numeric use the viewValue when calling on-change callback
    return this.$timeout(angular.noop, 0)
      .then(() => this.PciProjectStorageBlockService
        .getVolumePriceEstimation(this.projectId, this.editStorage))
      .then((estimatedPrice) => {
        this.estimatedPrice = estimatedPrice;
      });
  }

  edit() {
    return this.PciProjectStorageBlockService
      .update(this.projectId, this.editStorage, this.storage)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_edit_success_message',
            { volume: this.editStorage.name },
          ),
          'pci.projects.project.storages.blocks',
        );

        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_block_edit_error_put',
            { message: get(err, 'data.message', null), volume: this.editStorage.name },
          ),
          'pci.projects.project.storages.blocks.block.edit',
        );
      });
  }
}
