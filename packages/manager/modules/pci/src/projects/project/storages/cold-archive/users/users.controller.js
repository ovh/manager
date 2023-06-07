import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE, TRACKING } from './users.constants';
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

    this.USER_SUCCESS_BANNER = TRACKING.USER_SUCCESS_BANNER;
  }

  $onInit() {
    this.loadMessages();
    this.convertDate();
  }

  convertDate() {
    this.userList = this.userList.map((user) => ({
      ...user,
      gridPropertyCreationDate: new Date(user.creationDate),
    }));
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

  trackS3UsersPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${action}`;
    this.trackPage(hit);
  }

  trackS3UsersClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${action}`;
    this.trackClick(hit);
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
        }).then(() => {
          this.trackS3UsersPage(
            `${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_POLICY}_${COLD_ARCHIVE_TRACKING.STATUS.SUCCESS}`,
          );
          return this.CucCloudMessage.success(
            this.$translate.instant(
              'pci_projects_project_storages_containers_users_import_success_message',
              {
                user: user.username,
              },
            ),
            'pci.projects.project.storages.cold-archive.users',
          );
        });
      })
      .catch((err) => {
        this.trackS3UsersPage(
          `${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_POLICY}_${COLD_ARCHIVE_TRACKING.STATUS.ERROR}`,
        );
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_users_import_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'pci.projects.project.storages.cold-archive.users',
        );
      });
  }

  onAddUserClick() {
    this.trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ADD_USER);
    this.goToAddUser();
  }

  onShowSecretKeyClick(user) {
    this.scrollToTop();
    this.trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.DISPLAY_SECRET);
    this.PciStoragesColdArchiveService.getS3Secret(
      this.projectId,
      user.id,
      user.s3Credentials?.access,
    )
      .then((data) => {
        this.CucCloudMessage.info({
          textHtml: this.$translate.instant(
            'pci_projects_project_storages_containers_users_show_secret_key_success',
            {
              user: `<strong>${user.username}</strong>`,
              secret: `<code class="text-break">${data.secret}</code>`,
            },
          ),
        });
      })
      .catch((error) => {
        this.CucCloudMessage.error({
          textHtml: this.$translate.instant(
            'pci_projects_project_storages_containers_users_show_secret_key_error',
            {
              user: `<strong>${user.username}</strong>`,
              message: error?.data?.message,
            },
          ),
        });
      });
  }

  onImportPolicyClick(user) {
    this.trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.IMPORT_POLICY);
    this.goToImportPolicy(user);
  }

  onDownloadUserPolicy(user) {
    this.trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_POLICY);
    this.downloadJson(user);
  }

  onDeleteUserClick(user) {
    this.trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.DELETE_POLICY);
    this.goToDeleteUser(user);
  }

  onDownloadRCloneClick(user) {
    this.trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_RCLONE);
    this.downloadOpenStackRclone(user);
  }

  onClipboardFieldClick({ tracking }) {
    this.trackClick(tracking);
  }
}
