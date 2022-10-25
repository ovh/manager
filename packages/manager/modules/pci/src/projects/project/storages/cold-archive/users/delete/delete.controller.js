import get from 'lodash/get';
import { TRACKING } from '../users.constants';

export default class PciStoragesContainersUsersDeleteController {
  /* @ngInject */
  constructor($http, $translate, atInternet, PciStoragesColdArchiveService) {
    this.$http = $http;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  delete() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${TRACKING.DELETE_POLICY}::confirm`,
      type: 'action',
    });

    this.isDeleting = true;
    return this.PciStoragesColdArchiveService.removeAllCredentials(
      this.projectId,
      this.userId,
      this.credentials,
    )
      .then(() => {
        this.trackPage(`${TRACKING.DELETE_POLICY}-success`);
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_users_delete_success',
            {
              user: this.user.description,
            },
          ),
        );
      })
      .catch((error) => {
        this.trackPage(`${TRACKING.DELETE_POLICY}-error`);
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_users_delete_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isDeleting = false;
      });
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${TRACKING.DELETE_POLICY}::cancel`,
      type: 'action',
    });
    return this.goBack();
  }

  trackPage(page) {
    this.atInternet.trackPage({
      name: `${this.trackingPrefix}${page}`,
      type: 'navigation',
    });
  }
}
