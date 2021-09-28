import some from 'lodash/some';

import { ACTIVE_STATUS, PENDING_STATUS } from './users.constants';

export default class CloudProjectUsersCtrl {
  /* @ngInject */
  constructor($q, $translate, atInternet, CucCloudMessage) {
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.messageChannel = 'pci.projects.project.users';
    this.showRolesMatrix = false;
    this.isDescriptionAvailable = some(
      this.users,
      (user) => !!user.description,
    );
    this.isRolesAvailable = some(this.users, (user) => !!user.roles);
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(this.messageChannel, {
      onMessage: () => this.refreshMessages(),
    });
  }

  isDisabledOrPending($row) {
    return this.constructor.isPending($row) || this.isActionDisabled();
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  static isPending(user) {
    return PENDING_STATUS.includes(user.status);
  }

  static isActive(user) {
    return ACTIVE_STATUS.includes(user.status);
  }

  generatePassword(user) {
    this.atInternet.trackClick({
      name: 'PublicCloud::pci::projects::project::users::regen-password',
      type: 'action',
    });

    return this.regeneratePassword(user)
      .then(({ password }) => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_users_password_message_success',
            {
              user: user.username,
            },
          ),
          this.messageChannel,
        );
        this.CucCloudMessage.info(
          {
            textHtml: this.$translate.instant(
              'pci_projects_project_users_password_message_infos',
              {
                user: user.username,
                password,
              },
            ),
          },
          this.messageChannel,
        );
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_users_password_message_error',
            {
              user: user.username,
              message: err.message || err.data?.message,
            },
          ),
          this.messageChannel,
        );
      });
  }

  generateCredentials(user) {
    this.atInternet.trackClick({
      name: 'PublicCloud::pci::projects::project::users::get-s3-credentials',
      type: 'action',
    });
    return this.generateS3Credentials(user)
      .then(() =>
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_users_generate_s3_credentials_success',
            {
              user: user.username,
            },
          ),
          this.messageChannel,
        ),
      )
      .catch((err) =>
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_users_generate_s3_credentials_error',
            {
              user: user.username,
              message: err.message || err.data?.message,
            },
          ),
          this.messageChannel,
        ),
      );
  }
}
