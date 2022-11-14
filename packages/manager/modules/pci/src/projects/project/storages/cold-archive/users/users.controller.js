import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE, TRACKING } from './users.constants';

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
    if (this.trackingInfo)
      this.trackPage(`${TRACKING.ADD_POLICY}${this.trackingInfo}`);
    else this.trackPage(`${TRACKING.ADD_POLICY}`);
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
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${TRACKING.DOWNLOAD_POLICY}`,
      type: 'action',
    });

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

  showSecretKey(user) {
    this.scrollToTop();
    this.CucCloudMessage.info({
      textHtml: this.$translate.instant(
        'pci_projects_project_storages_containers_users_show_secret_key_success',
        {
          user: user.username,
          secret: `<code class="text-break">${user.s3Credentials[0].secret}</code>`,
        },
      ),
    });
  }

  trackPage(page) {
    this.atInternet.trackPage({
      name: `${this.trackingPrefix}${page}`,
      type: 'navigation',
    });
  }
}
