import find from 'lodash/find';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';

export default class CloudProjectUsersCtrl {
  /* @ngInject */
  constructor($q, $translate, CucCloudMessage) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.messageChannel = 'pci.projects.project.users';
    this.showRolesMatrix = false;
    this.isDescriptionAvailable = !!find(this.users, (user) => {
      return !isUndefined(user.description);
    });
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(this.messageChannel, {
      onMessage: () => this.refreshMessages(),
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  generatePassword(user) {
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
              message: get(err, 'data.message', null),
            },
          ),
          this.messageChannel,
        );
      });
  }
}
