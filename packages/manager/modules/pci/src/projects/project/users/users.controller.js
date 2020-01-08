import get from 'lodash/get';

export default class CloudProjectUsersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectUserRole,
    PciProjectsProjectUsersService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectUserRole = OvhApiCloudProjectUserRole;
    this.PciProjectsProjectUsersService = PciProjectsProjectUsersService;
  }

  $onInit() {
    this.showRolesMatrix = false;
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.users',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  generatePassword(user) {
    return this.PciProjectsProjectUsersService.regeneratePassword(
      this.projectId,
      user,
    )
      .then(({ password }) => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_users_password_message_success',
            {
              user: user.username,
            },
          ),
        );
        this.CucCloudMessage.info({
          textHtml: this.$translate.instant(
            'pci_projects_project_users_password_message_infos',
            {
              user: user.username,
              password,
            },
          ),
        });
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
        );
      });
  }
}
