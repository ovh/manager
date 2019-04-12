import get from 'lodash/get';
import pick from 'lodash/pick';

import BlockStorage from '../../../blocks/block.class';

export default class PciBlockStorageSnapshotsCreateVolumeController {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    CucCloudMessage,
    PciProjectStorageSnapshotsService,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageSnapshotsService = PciProjectStorageSnapshotsService;
  }

  $onInit() {
    this.loadings = {
      init: false,
      save: false,
    };

    this.initLoaders();
  }

  initLoaders() {
    this.loadings.init = true;

    this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getSnapshot())
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_snapshots_snapshot_create-volume_error_load',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loadings.init = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.snapshots.snapshot.create-volume');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.snapshots.snapshot.create-volume',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getSnapshot() {
    return this.PciProjectStorageSnapshotsService
      .get(this.projectId, this.snapshotId)
      .then((snapshot) => {
        this.storage = new BlockStorage({
          ...pick(
            snapshot,
            [
              'region',
              'name',
              'size',
              'bootable',
            ],
          ),
          type: snapshot.volume.type,
          snapshotId: snapshot.id,
        });
        return this.editStorage;
      });
  }

  save() {
    this.loadings.save = true;
    return this.PciProjectStorageSnapshotsService
      .createVolume(this.projectId, this.storage)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_snapshots_snapshot_create-volume_success_message',
            { volume: this.storage.name },
          ),
          'pci.projects.project.storages.snapshots.snapshot',
        );

        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_snapshots_snapshot_create-volume_error_post',
            { message: get(err, 'data.message', null), volume: this.storage.name },
          ),
          'pci.projects.project.storages.snapshots.snapshot.create-volume',
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
