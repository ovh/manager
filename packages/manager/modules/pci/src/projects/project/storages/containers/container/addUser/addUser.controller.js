import { OBJECT_CONTAINER_USER_ROLES } from './addUser.constants';

export default class PciBlockStorageDetailsAddUserController {
  /* @ngInject */
  constructor(
    $translate,
    $http,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.$http = $http;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;

    this.OBJECT_CONTAINER_USER_ROLES = OBJECT_CONTAINER_USER_ROLES;
  }

  $onInit() {
    this.selectedUser = null;
    this.selectedRole = null;
    this.addUserStep = 0;
  }

  stepBack() {
    this.addUserStep = 0;
  }

  onUserSelect() {
    this.addUserStep = 1;
  }

  addUserStorage() {
    if (this.addUserStep < 1) {
      this.addUserStep += 1;
      return null;
    }
    this.isLoading = true;
    return this.$http
      .post(
        `/cloud/project/${this.projectId}/region/${this.container.region}/storage/${this.container.name}/policy/${this.selectedUser}`,
        {
          roleName: this.selectedRole,
        },
      )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_addUser_success_message',
            {
              container: this.container.name,
              name: this.selectedUser,
              role: this.selectedRole,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_container_addUser_error_addUser',
            {
              message: err.message || err.data?.message,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
