import { OBJECT_CONTAINER_USER_ROLES } from './add-user.constants';
import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

export default class ColdArchiveContainersAddUserController {
  /* @ngInject */
  constructor(
    $translate,
    $http,
    atInternet,
    CucCloudMessage,
    PciStoragesColdArchiveService,
  ) {
    this.$translate = $translate;
    this.$http = $http;
    this.atInternet = atInternet;
    this.cucCloudMessage = CucCloudMessage;
    this.pciStoragesColdArchiveService = PciStoragesColdArchiveService;

    this.OBJECT_CONTAINER_USER_ROLES = OBJECT_CONTAINER_USER_ROLES;
  }

  $onInit() {
    this.selectedUser = null;
    [this.selectedRole] = this.OBJECT_CONTAINER_USER_ROLES;
    this.addUserStep = 0;

    this.setUserCredentialsList();
    this.preselectFirstUser();
  }

  trackAddUserModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}_${action}`;
    this.trackPage(hit);
  }

  trackAddUserModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}::${action}`;
    this.trackClick(hit);
  }

  setUserCredentialsList() {
    this.usersCredentials = this.allUserList
      .filter((user) => user?.s3Credentials)
      .map((user) => ({
        ...user,
        credentialTrad: this.getCredentialTranslation(user),
        addUserNameDescriptionKey: user.description
          ? `${user.username} - ${user.description}`
          : user.username,
      }));
  }

  getCredentialTranslation(user) {
    return this.$translate.instant(
      user?.s3Credentials
        ? 'pci_projects_project_storages_coldArchive_containers_addUser_select_user_has_credential'
        : 'pci_projects_project_storages_coldArchive_containers_addUser_select_user_has_not_credential',
    );
  }

  preselectFirstUser() {
    [this.selectedUser] = this.usersCredentials || [];
  }

  stepBack() {
    this.addUserStep = 0;
  }

  addUserStorage() {
    if (this.addUserStep < 1) {
      this.addUserStep += 1;
      return null;
    }
    this.trackAddUserModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    this.isLoading = true;
    return this.$http
      .post(
        `/cloud/project/${this.projectId}/region/${this.regions[0]}/storage/${this.container.name}/policy/${this.selectedUser.id}`,
        {
          roleName: this.selectedRole,
          objectKey: this.objectKey,
        },
      )
      .then(() => {
        this.trackAddUserModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
        return this.goBack(
          this.$translate.instant(
            this.objectKey
              ? 'pci_projects_project_storages_coldArchive_containers_addUser_object_success_message'
              : 'pci_projects_project_storages_coldArchive_containers_addUser_success_message',
            {
              value: this.objectKey || this.container.name,
              name: this.selectedUser.description,
              role: this.$translate.instant(
                `pci_projects_project_storages_coldArchive_containers_addUser_right_${this.selectedRole}`,
              ),
            },
          ),
        );
      })
      .catch((err) => {
        this.trackAddUserModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
        return this.goBack(
          this.$translate.instant(
            this.objectKey
              ? 'pci_projects_project_storages_coldArchive_containers_addUser_object_error_addUser'
              : 'pci_projects_project_storages_coldArchive_containers_addUser_error_addUser',
            {
              value: this.objectKey || this.container.name,
              message: err.message || err.data?.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackAddUserModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.goBack();
  }
}
