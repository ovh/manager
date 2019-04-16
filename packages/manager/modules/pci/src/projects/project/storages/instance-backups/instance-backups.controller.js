import get from 'lodash/get';

export default class PciInstanceBackupsController {
  /* @ngInject */
  constructor(
    $rootScope,
    $translate,
    CucCloudMessage,
    CucRegionService,
    PciProjectStorageInstanceBackupService,
  ) {
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectStorageInstanceBackupService = PciProjectStorageInstanceBackupService;
  }

  $onInit() {
    this.$rootScope.$on('pci_instance_backups_refresh', () => this.refreshInstanceBackups());
    this.initLoaders();
  }

  initLoaders() {
    this.loading = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getInstanceBackups())
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_instance_backups_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  getInstanceBackups() {
    return this.PciProjectStorageInstanceBackupService
      .getAll(this.projectId)
      .then((instanceBackups) => {
        this.instanceBackups = instanceBackups;
        return this.instanceBackups;
      });
  }

  refreshInstanceBackups() {
    this.loading = true;
    return this.getInstanceBackups()
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_instance_backups_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.instance-backups');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.instance-backups',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
