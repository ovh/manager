import get from 'lodash/get';
import { TRACKING_S3_POLICY_DELETE } from '../users.constants';

export default class PciStoragesContainersUsersDeleteController {
  /* @ngInject */
  constructor($http, $translate, atInternet, PciStoragesObjectStorageService) {
    this.$http = $http;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.PciStoragesObjectStorageService = PciStoragesObjectStorageService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  delete() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${TRACKING_S3_POLICY_DELETE}::confirm`,
      type: 'action',
    });

    this.isDeleting = true;
    return this.PciStoragesObjectStorageService.removeAllCredentials(
      this.projectId,
      this.userId,
      this.credentials,
    )
      .then(() => {
        this.trackPage(`${TRACKING_S3_POLICY_DELETE}-success`);
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
        this.trackPage(`${TRACKING_S3_POLICY_DELETE}-error`);
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
      name: `${this.trackingPrefix}${TRACKING_S3_POLICY_DELETE}::cancel`,
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
