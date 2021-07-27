import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE } from './users.constants';

const { saveAs } = require('file-saver');

export default class PciStoragesContainersUsersController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PciStoragesObjectStorageService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesObjectStorageService = PciStoragesObjectStorageService;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.object.users',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  downloadJson(user) {
    return this.PciStoragesObjectStorageService.getUserStoragePolicy(
      this.projectId,
      user.id,
    )
      .then(({ policy }) => {
        const data = new Blob([[policy]], { type: DOWNLOAD_TYPE });
        saveAs(data, DOWNLOAD_FILENAME);

        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(data);
        }).then(() =>
          this.CucCloudMessage.success(
            this.$translate.instant(
              'pci_projects_project_storages_containers_users_import_success_message',
              {
                user: user.username,
              },
            ),
            'pci.projects.project.storages.object.users',
          ),
        );
      })
      .catch((err) =>
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_users_import_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'pci.projects.project.storages.object.users',
        ),
      );
  }
}
