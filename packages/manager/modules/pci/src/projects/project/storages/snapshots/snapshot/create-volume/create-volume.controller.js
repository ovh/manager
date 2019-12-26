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
    this.isLoading = false;
    this.loadMessages();

    this.storage = new BlockStorage({
      ...pick(this.snapshot, ['region', 'name', 'size', 'bootable']),
      type: this.snapshot.volume.type,
      snapshotId: this.snapshot.id,
    });
  }

  loadMessages() {
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

  save() {
    this.isLoading = true;
    return this.PciProjectStorageSnapshotsService.createVolume(
      this.projectId,
      this.storage,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_snapshots_snapshot_create-volume_success_message',
            { volume: this.storage.name },
          ),
        ),
      )
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_snapshots_snapshot_create-volume_error_post',
            {
              message: get(err, 'data.message', null),
              volume: this.storage.name,
            },
          ),
          'pci.projects.project.storages.snapshots.snapshot.create-volume',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
