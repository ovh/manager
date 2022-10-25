import { TRACKING } from '../users.constants';

export default class PciBlockStorageContainersContainerObjectAddController {
  /* @ngInject */
  constructor($http, $translate, atInternet, PciStoragesColdArchiveService) {
    this.$http = $http;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
    this.files = [];
  }

  static isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  importFile() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${TRACKING.IMPORT_POLICY}::confirm`,
      type: 'action',
    });

    this.isLoading = true;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(this.files[0], 'utf-8');
      reader.onloadend = () => resolve(reader.result);
    }).then((fileData) => {
      if (this.constructor.isJson(fileData)) {
        return this.PciStoragesColdArchiveService.importUserPolicy(
          this.projectId,
          this.userId,
          fileData,
        )
          .then(() =>
            this.goBack(
              this.$translate.instant(
                'pci_projects_project_storages_containers_users_import_success',
                { username: this.user.username },
              ),
            ),
          )
          .catch((err) =>
            this.goBack(
              this.$translate.instant(
                'pci_projects_project_storages_containers_users_import_error',
                {
                  username: this.user.username,
                  message: err.data?.message || null,
                },
              ),
              'error',
            ),
          )
          .finally(() => {
            this.isLoading = false;
          });
      }
      return this.goBack(
        this.$translate.instant(
          'pci_projects_project_storages_containers_users_import_read_page_error',
        ),
        'error',
      );
    });
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${TRACKING.IMPORT_POLICY}::cancel`,
      type: 'action',
    });
    return this.goBack();
  }
}
