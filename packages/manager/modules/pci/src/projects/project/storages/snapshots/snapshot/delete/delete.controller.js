import get from 'lodash/get';

export default class PciBlockStorageDetailsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectStorageSnapshotsService,
  ) {
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
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.PciProjectStorageSnapshotsService.get(this.projectId, this.snapshotId))
      .then((snapshot) => {
        this.snapshot = snapshot;
        return this.snapshot;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_snapshots_snapshot_delete_error_load',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loadings.init = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.snapshots.delete');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.snapshots.delete',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  deleteSnapshot() {
    this.loadings.save = true;
    return this.PciProjectStorageSnapshotsService.delete(this.projectId, this.snapshot)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_snapshots_snapshot_delete_success_message',
            {
              snapshot: this.snapshot.name,
            },
          ),
          'pci.projects.project.storages.snapshots',
        );
        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_snapshots_snapshot_delete_error_delete',
            {
              message: get(err, 'data.message', null),
              snapshot: this.snapshot.name,
            },
          ),
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
