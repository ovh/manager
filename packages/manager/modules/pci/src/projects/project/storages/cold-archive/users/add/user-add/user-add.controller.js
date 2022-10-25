import {
  NAMESPACES,
  TRACKING,
  USER_STATUS,
  OBJECT_STORAGE_USER_ROLE,
} from '../../users.constants';

export default class PciUsersAddController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    atInternet,
    CucCloudMessage,
    PciStoragesColdArchiveService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
    this.addExistingUser = 'addExistingUser';
    this.createNewUser = 'createNewUser';
    this.users = this.allUserList
      .filter((user) => user && user.status === 'ok')
      .map((user) => ({
        ...user,
        asCredentials: this.usersCredentials.find(
          (credential) => credential.userId === user.id,
        ).asCredentials
          ? this.$translate.instant(
              'pci_projects_project_users_add_as_credentials',
            )
          : this.$translate.instant(
              'pci_projects_project_users_add_as_no_credentials',
            ),
      }));
    this.usersWithoutCredentials = this.users
      .filter(({ s3Credentials }) => !s3Credentials.length)
      .map((user) => ({
        ...user,
        userNameDescriptionKey: user.description
          ? `${user.username} - ${user.description}`
          : user.username,
      }));
    this.isUserCouldGenerateCredentails =
      this.usersWithoutCredentials?.length > 0;
    [this.userModel] = this.usersWithoutCredentials;
  }

  onChange(action) {
    this.model = action;
  }

  onCancel() {
    this.trackClick(`${TRACKING.ADD_POLICY}::cancel`);
    return this.cancel();
  }

  onSubmit(user) {
    this.trackClick(`${TRACKING.ADD_POLICY}::confirm`);
    this.isLoading = true;
    if (!this.isUserCreationModeActive()) {
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
    return this.createUser(this.newUserDescription)
      .then((data) => this.generateUserS3Credential(data))
      .finally(() => {
        this.isLoading = false;
      });
  }

  isUserLinkedModeActive() {
    return this.model === this.addExistingUser;
  }

  isUserCreationModeActive() {
    return this.model === this.createNewUser;
  }

  canUserBeCreated() {
    return (
      (this.isUserLinkedModeActive() && this.userModel) ||
      (this.isUserCreationModeActive() && this.newUserDescription)
    );
  }

  getUserS3Credential(userId) {
    return this.PciStoragesColdArchiveService.getS3Credentials(
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
    return this.PciStoragesColdArchiveService.createUser(
      this.projectId,
      description,
      OBJECT_STORAGE_USER_ROLE,
    )
      .then((user) => {
        return this.PciStoragesColdArchiveService.pollUserStatus(
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
    return this.PciStoragesColdArchiveService.generateS3Credentials(
      this.projectId,
      user.id,
    )
      .then((data) => this.goBack(true, user, data, `-success`))
      .catch(() => {
        this.trackPage(`${TRACKING.GENERATE_CREDENTIAL}-error`);
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
