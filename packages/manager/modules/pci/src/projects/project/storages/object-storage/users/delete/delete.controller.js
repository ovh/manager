import get from 'lodash/get';

export default class PciStoragesContainersUsersDeleteController {
  /* @ngInject */
  constructor($http, $translate, PciStoragesObjectStorageService) {
    this.$http = $http;
    this.$translate = $translate;
    this.PciStoragesObjectStorageService = PciStoragesObjectStorageService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  delete() {
    this.isDeleting = true;
    return this.PciStoragesObjectStorageService.removeAllCredentials(
      this.projectId,
      this.userId,
      this.credentials,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_users_delete_success',
            {
              user: this.user.description,
            },
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_users_delete_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isDeleting = false;
      });
  }
}
