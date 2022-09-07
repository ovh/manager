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

    this.setUserCredentialsList();
    this.preselectFirstUser();
  }

  setUserCredentialsList() {
    this.usersCredentials = this.availableUsers.map((user) => ({
      ...user,
      credentialTrad: this.getCredentialTranslation(user),
      addUserNameDescriptionKey: user.description
        ? `${user.username} - ${user.description}`
        : user.username,
    }));
  }

  getCredentialTranslation(user) {
    return this.$translate.instant(
      user.s3Credentials.length > 0
        ? 'pci_projects_project_storages_containers_container_addUser_select_user_has_credential'
        : 'pci_projects_project_storages_containers_container_addUser_select_user_has_not_credential',
    );
  }

  preselectFirstUser() {
    [this.selectedUser] = this.usersCredentials || [];
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
        `/cloud/project/${this.projectId}/region/${this.container.region}/storage/${this.container.name}/policy/${this.selectedUser.id}`,
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
              value: this.objectKey || this.container.name,
              name: this.selectedUser.description,
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
            this.objectKey
              ? 'pci_projects_project_storages_containers_container_addUser_object_error_addUser'
              : 'pci_projects_project_storages_containers_container_addUser_error_addUser',
            {
              value: this.objectKey || this.container.name,
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
