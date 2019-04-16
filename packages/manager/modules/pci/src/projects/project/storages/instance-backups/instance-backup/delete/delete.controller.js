import get from 'lodash/get';

export default class PciBlockStorageDetailsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectStorageInstanceBackupService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageInstanceBackupService = PciProjectStorageInstanceBackupService;
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
      .then(() => this.PciProjectStorageInstanceBackupService
        .get(this.projectId, this.instanceBackupId))
      .then((instanceBackup) => {
        this.instanceBackup = instanceBackup;
        return this.instanceBackup;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_volume-instances_volume-instance_delete_error_load',
            { message: get(err, 'data.message', '') },
          ),
        );
      })
      .finally(() => {
        this.loadings.init = false;
      });
  }

  loadMessages() {
    return new Promise((resolve) => {
      this.CucCloudMessage.unSubscribe('pci.projects.project.storages.volume-instances.delete');
      this.messageHandler = this.CucCloudMessage.subscribe(
        'pci.projects.project.storages.volume-instances.delete',
        {
          onMessage: () => this.refreshMessages(),
        },
      );
      resolve();
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  deleteStorage() {
    this.loadings.save = true;
    return this.PciProjectStorageInstanceBackupService.delete(this.projectId, this.instanceBackup)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_volume-instances_volume-instance_delete_success_message',
            {
              snapshot: this.instanceBackup.name,
            },
          ),
          'pci.projects.project.storages.instance-backups',
        );
        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_volume-instances_volume-instance_delete_error_delete',
            {
              message: get(err, 'data.message', null),
              snapshot: this.instanceBackup.name,
            },
          ),
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
