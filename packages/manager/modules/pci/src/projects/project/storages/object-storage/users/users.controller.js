import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE, DOWNLOAD_RCLONE_FILETYPE, DOWNLOAD_RCLONE_FILENAME } from './users.constants';

const { saveAs } = require('file-saver');

export default class PciStoragesContainersUsersController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucCloudMessage,
    PciStoragesObjectStorageService,
    $http,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesObjectStorageService = PciStoragesObjectStorageService;
    this.$http = $http;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.object-storage.users',
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
      name: `${this.trackingPrefix}s3-policies-users::download-json`,
      type: 'action',
    });

    return this.PciStoragesObjectStorageService.getUserStoragePolicy(
      this.projectId,
      user.id,
    )
      .then(({ policy }) => {
        console.log();
        const data = new Blob([[policy]], { type: DOWNLOAD_TYPE });
        console.log("data",data);
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
            'pci.projects.project.storages.object-storage.users',
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
          'pci.projects.project.storages.object-storage.users',
        ),
      );
  }

  downloadRcloneFile(user) {
       console.log("downloadRcloneFile",user);
       this.downloadOpenStackRclone(user);
       /* this.$http.get(`/cloud/project/${user.s3Credentials[0].tenantId}/user/${user.id}/rclone?region="SBG"`)
            .then(({data}) => {
                console.log("Content",data.content);
                const data2 = new Blob([data.content], { type: DOWNLOAD_RCLONE_FILETYPE });
                console.log("data2",data2);
                saveAs(data2, DOWNLOAD_RCLONE_FILENAME);
            })
            .catch(() => {

            })
            .finally(() => {
              
            })*/
  }

  showSecretKey(user){
    console.log("showSecretKey",user);
    this.CucCloudMessage.success(
      this.$translate.instant(
        'pci_projects_project_storages_containers_users_show_secret_key_success',
        {
          user: user.username,
          secret: user.s3Credentials[0].secret,
        },
      ),
    )
  }
  
}
