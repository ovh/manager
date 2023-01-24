import get from 'lodash/get';
import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

export default class PciStoragesContainersUsersDeleteController {
  /* @ngInject */
  constructor($http, $translate, PciStoragesColdArchiveService) {
    this.$http = $http;
    this.$translate = $translate;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  delete() {
    this.trackDeleteUserModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);

    this.isDeleting = true;
    return this.PciStoragesColdArchiveService.removeAllCredentials(
      this.projectId,
      this.userId,
      this.credentials,
    )
      .then(() => {
        this.trackDeleteUserModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
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
        this.trackDeleteUserModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
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
    this.trackDeleteUserModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.goBack();
  }

  trackDeleteUserModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DELETE_POLICY}_${action}`;
    this.trackPage(hit);
  }

  trackDeleteUserModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DELETE_POLICY}::${action}`;
    this.trackClick(hit);
  }
}
