export default class AiDashboardUsersTokensCtrl {
  /* @ngInject */
  constructor(atInternet, $translate, CucCloudMessage, AiDashboardService) {
    this.atInternet = atInternet;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.AiDashboardService = AiDashboardService;
  }

  $onInit() {
    this.messageContainer = 'pci.projects.project.ai-dashboard.users-tokens';
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  trackAndGoToCreateUser() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::create-user`,
      type: 'action',
    });
    return this.goToCreateUser();
  }

  trackAndGoToManageUsers() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::manage-users`,
      type: 'action',
    });
    return this.goToManageUser();
  }

  trackAndGoToCreateToken() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::create-token`,
      type: 'action',
    });
    return this.goToCreateToken();
  }

  trackAndGoToDeleteToken(token) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::delete-token`,
      type: 'action',
    });
    return this.goToDeleteToken(token);
  }

  trackAndRenewToken(token) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::renew-token`,
      type: 'action',
    });
    this.AiDashboardService.renewToken(this.projectId, token.id).then(
      (data) => {
        this.CucCloudMessage.success(
          {
            textHtml: `Votre token ${token.spec.name} a correctement regénéré: <code>${data.status.value}</code>`,
          },
          this.messageContainer,
        );
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
