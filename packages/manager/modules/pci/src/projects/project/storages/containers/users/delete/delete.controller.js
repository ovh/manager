import get from 'lodash/get';

export default class PciStoragesContainersUsersDeleteController {
  /* @ngInject */
  constructor($http, $translate, PciProjectStorageContainersService) {
    this.$http = $http;
    this.$translate = $translate;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.isDeleting = false;
  }

  delete() {
    this.isDeleting = true;
    return this.PciProjectStorageContainersService.removeAllCredentials(
      this.projectId,
      this.userId,
      this.credentials,
    )
      .then(() =>
        this.goToUsers(
          this.$translate.instant(
            'pci_projects_project_storages_containers_users_delete_success',
            {
              user: this.user.description,
            },
          ),
        ),
      )
      .catch((error) =>
        this.goToUsers(
          this.$translate.instant(
            'pci_projects_project_storages_containers_users_delete_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
