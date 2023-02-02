import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

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
    this.trackImportModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
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
          .then(() => {
            this.trackImportModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
            return this.goBack(
              this.$translate.instant(
                'pci_projects_project_storages_containers_users_import_success',
                { username: this.user.username },
              ),
            );
          })
          .catch((err) => {
            return this.goBack(
              this.$translate.instant(
                'pci_projects_project_storages_containers_users_import_error',
                {
                  username: this.user.username,
                  message: err.data?.message || null,
                },
              ),
              'error',
            );
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
      this.trackImportModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
      return this.goBack(
        this.$translate.instant(
          'pci_projects_project_storages_containers_users_import_read_page_error',
        ),
        'error',
      );
    });
  }

  cancel() {
    this.trackImportModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.goBack();
  }

  trackImportModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.IMPORT_POLICY}_${action}`;
    return this.trackPage(hit);
  }

  trackImportModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.IMPORT_POLICY}::${action}`;
    return this.trackClick(hit);
  }
}
