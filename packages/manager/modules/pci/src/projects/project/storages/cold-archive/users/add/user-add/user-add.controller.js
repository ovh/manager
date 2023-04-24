import {
  NAMESPACES,
  OBJECT_STORAGE_USER_ROLE,
  USER_STATUS,
} from '../../users.constants';

import { COLD_ARCHIVE_TRACKING } from '../../../cold-archives.constants';

export default class PciUsersAddController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    CucCloudMessage,
    PciStoragesColdArchiveService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.isLoading = false;
    this.addExistingUser = 'addExistingUser';
    this.createNewUser = 'createNewUser';
    this.users = this.getValidUsers();
    this.usersWithoutCredentials = this.getUsersHaveNotCredentials();
    this.isUserCouldGenerateCredentails =
      this.usersWithoutCredentials?.length > 0;
    [this.userModel] = this.usersWithoutCredentials;
  }

  onChange(action) {
    this.model = action;
  }

  getValidUsers() {
    return this.allUserList
      .filter((user) => user && user.status === 'ok')
      .map((user) => ({
        ...user,
        asCredentials: this.usersWithCredentials.find(
          (s3Credentials) => s3Credentials.userId === user.id,
        )
          ? this.$translate.instant(
              'pci_projects_project_users_add_as_credentials',
            )
          : this.$translate.instant(
              'pci_projects_project_users_add_as_no_credentials',
            ),
      }));
  }

  getUsersHaveNotCredentials() {
    return this.users
      .filter(({ s3Credentials }) => !s3Credentials)
      .map((user) => ({
        ...user,
        userNameDescriptionKey: user.description
          ? `${user.username} - ${user.description}`
          : user.username,
      }));
  }

  trackUserAddClick(action) {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ADD_USER}::${action}`,
    );
  }

  onCancel() {
    this.trackUserAddClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.cancel();
  }

  onSubmit(user) {
    this.isLoading = true;
    if (!this.isUserCreationModeActive()) {
      this.trackUserAddClick(
        COLD_ARCHIVE_TRACKING.USER.CREATE_USER_MODES.EXISTING_USER,
      );
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
    this.trackUserAddClick(
      COLD_ARCHIVE_TRACKING.USER.CREATE_USER_MODES.NEW_USER,
    );
    return this.PciStoragesColdArchiveService.createUser(
      this.projectId,
      description,
      OBJECT_STORAGE_USER_ROLE,
    )
      .then((user) =>
        this.PciStoragesColdArchiveService.pollUserStatus(
          this.projectId,
          user.id,
          USER_STATUS.OK,
          NAMESPACES.CREATE_USER,
        ),
      )
      .then((user) => user)
      .catch(() => {
        this.trackPage(
          `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ADD_USER}_${COLD_ARCHIVE_TRACKING.STATUS.ERROR}`,
        );
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
      .then((data) => {
        this.trackPage(
          `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ADD_USER}_${COLD_ARCHIVE_TRACKING.STATUS.SUCCESS}`,
        );
        return this.goBack(true, user, data, `-success`);
      })
      .catch(() => {
        this.trackPage(
          `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ADD_USER}_${COLD_ARCHIVE_TRACKING.STATUS.ERROR}`,
        );
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
}
