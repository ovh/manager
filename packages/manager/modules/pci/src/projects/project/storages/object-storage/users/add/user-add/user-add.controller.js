import {
  NAMESPACES,
  TRACKING_S3_POLICY_ADD,
  USER_STATUS,
} from '../../users.constants';

export default class PciUsersAddController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciStoragesObjectStorageService,
    $state,
    atInternet,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesObjectStorageService = PciStoragesObjectStorageService;
    this.$state = $state;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.isLoading = false;
    this.disable = true;
    this.addExistingUser = 'addExistingUser';
    this.createNewUser = 'createNewUser';
    this.allUserList = this.allUserList.map((userList) => ({
      ...userList,
      asCredentials: this.usersCredentials.find(
        (credential) => credential.userId === userList.id,
      ).asCredentials
        ? this.$translate.instant(
            'pci_projects_project_users_add_as_credentials',
          )
        : this.$translate.instant(
            'pci_projects_project_users_add_as_no_credentials',
          ),
    }));
    [this.userModel] = this.allUserList;
  }

  onChange(action) {
    this.model = action;
    this.disable = false;
  }

  onCancel() {
    this.trackClick(`${TRACKING_S3_POLICY_ADD}::cancel`);
    return this.cancel();
  }

  onSubmit(user, action) {
    this.trackClick(`${TRACKING_S3_POLICY_ADD}::cconfirm`);
    this.isLoading = true;
    if (action === 'addExistingUser') {
      return this.getUserS3Credential(user.id)
        .then((credentials) => {
          if (credentials.length === 0)
            return this.generateUserS3Credential(user);

          return this.goBack(true, user, { ...credentials.pop() }, `-success`);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
    // action === 'createNewUser'
    return this.createUser(user.description)
      .then((data) => this.generateUserS3Credential(data))
      .finally(() => {
        this.isLoading = false;
      });
  }

  getUserS3Credential(userId) {
    return this.PciStoragesObjectStorageService.getS3Credentials(
      this.projectId,
      userId,
    )
      .then((data) => data)
      .catch(() => {
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_users_add_error_message',
          ),
        );
      });
  }

  createUser(description) {
    return this.PciStoragesObjectStorageService.createUser(
      this.projectId,
      description,
    )
      .then((user) => {
        return this.PciStoragesObjectStorageService.pollUserStatus(
          this.projectId,
          user.id,
          USER_STATUS.OK,
          NAMESPACES.CREATE_USER,
        );
      })
      .then((user) => user)
      .catch(() => {
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_users_add_error_message',
          ),
        );
      });
  }

  generateUserS3Credential(user) {
    return this.PciStoragesObjectStorageService.generateS3Credentials(
      this.projectId,
      user.id,
    )
      .then((data) => this.goBack(true, user, data, `-success`))
      .catch(() => {
        this.trackPage(`${TRACKING_S3_POLICY_ADD}-error`);
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_users_add_error_message',
            {
              user: user.description,
            },
          ),
        );
      });
  }

  trackPage(page) {
    this.atInternet.trackPage({
      name: `${this.trackingPrefix}${page}`,
      type: 'navigation',
    });
  }

  trackClick(action) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}${action}`,
      type: 'action',
    });
  }
}
