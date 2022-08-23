import { OBJECT_CONTAINER_USER_ROLES } from './addUser.constants';

export default class PciBlockStorageDetailsAddUserController {
  /* @ngInject */
  constructor(
    $translate,
    $http,
    atInternet,
    CucCloudMessage,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.$http = $http;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;

    this.OBJECT_CONTAINER_USER_ROLES = OBJECT_CONTAINER_USER_ROLES;
  }

  $onInit() {
    this.selectedUser = null;
    this.selectedRole = null;
    this.addUserStep = 0;
    if (this.availableUsers.length === 1) {
      this.selectedUser = this.availableUsers[0].id;
    }
  }

  stepBack() {
    this.addUserStep = 0;
  }

  trackNextStepClick() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${
        this.objectKey ? 'object::' : ''
      }add-user::next`,
      type: 'action',
    });
  }

  addUserStorage() {
    if (this.addUserStep < 1) {
      this.addUserStep += 1;
      this.trackNextStepClick();
      return null;
    }
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${
        this.objectKey ? 'object::' : ''
      }add-user::confirm`,
      type: 'action',
    });
    this.isLoading = true;
    return this.$http
      .post(
        `/cloud/project/${this.projectId}/region/${this.container.region}/storage/${this.container.name}/policy/${this.selectedUser}`,
        {
          roleName: this.selectedRole,
          objectKey: this.objectKey,
        },
      )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            this.objectKey
              ? 'pci_projects_project_storages_containers_container_addUser_object_success_message'
              : 'pci_projects_project_storages_containers_container_addUser_success_message',
            {
              container: this.container.name,
              name: this.selectedUser,
              role: this.$translate.instant(
                `pci_projects_project_storages_containers_container_addUser_right_${this.selectedRole}`,
              ),
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

  cancel() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${
        this.objectKey ? 'object::' : ''
      }add-user::cancel`,
      type: 'action',
    });
    return this.goBack();
  }
}
