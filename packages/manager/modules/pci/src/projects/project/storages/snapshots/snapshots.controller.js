import get from 'lodash/get';

export default class PciStorageSnapshotsController {
  /* @ngInject */
  constructor(
    $rootScope,
    $translate,
    CucCloudMessage,
    PciProjectStorageSnapshotsService,
  ) {
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageSnapshotsService = PciProjectStorageSnapshotsService;
  }

  $onInit() {
    this.$rootScope.$on('pci_storages_blocks_refresh', () => this.refreshBlocks());
    this.initLoaders();
  }

  initLoaders() {
    this.loading = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getSnapshots())
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_snapshots_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  getSnapshots() {
    return this.PciProjectStorageSnapshotsService
      .getAll(this.projectId)
      .then((snapshots) => {
        this.snapshots = snapshots;
        return this.snapshots;
      });
  }

  refreshBlocks() {
    this.loading = true;
    return this.getSnapshots()
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_snapshots_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.snapshots');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.snapshots',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
