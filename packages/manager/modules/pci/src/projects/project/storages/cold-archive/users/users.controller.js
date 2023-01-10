import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE } from './users.constants';
import { COLD_ARCHIVE_TRACKING } from '../cold-archives.constants';

const { saveAs } = require('file-saver');

export default class PciStoragesContainersUsersController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucCloudMessage,
    PciStoragesColdArchiveService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.loadMessages();
    this.trackPage(`${COLD_ARCHIVE_TRACKING.USER.MAIN}`);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.cold-archive.users',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  downloadJson(user) {
    return this.PciStoragesColdArchiveService.getUserStoragePolicy(
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
            'pci.projects.project.storages.cold-archive.users',
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
          'pci.projects.project.storages.cold-archive.users',
        ),
      );
  }

  onAddUserClick() {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ADD_USER}`,
    );
    this.goToAddUser();
  }

  onShowSecretKeyClick(user) {
    this.scrollToTop();
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DISPLAY_SECRET}`,
    );
    this.CucCloudMessage.info({
      textHtml: this.$translate.instant(
        'pci_projects_project_storages_containers_users_show_secret_key_success',
        {
          user: `<strong>${user.username}</strong>`,
          secret: `<code class="text-break">${user.s3Credentials[0].secret}</code>`,
        },
      ),
    });
  }

  onImportPolicyClick(user) {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.IMPORT_POLICY}`,
    );
    this.goToImportPolicy(user);
  }

  onDownloadUserPolicy(user) {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_POLICY}`,
    );
    this.downloadJson(user);
  }

  onDeleteUserClick(user) {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DELETE_USER}`,
    );
    this.goToDeleteUser(user);
  }

  onDownloadRCloneClick(user) {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_RCLONE}`,
    );
    this.downloadOpenStackRclone(user);
  }
}
