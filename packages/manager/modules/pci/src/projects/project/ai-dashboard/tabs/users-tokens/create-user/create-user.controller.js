export default class AIDashboadCreateUserCtrl {
  /* @ngInject */
  constructor($translate, atInternet, AIDashboardService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.AIDashboardService = AIDashboardService;
  }

  addUser() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::create-user::validate`,
      type: 'action',
    });
    this.processing = true;
    return this.AIDashboardService.addUser(this.projectId, {
      description: this.model.description,
      role: this.model.role,
    })
      .then((user) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_ai_dashboard_create_user_success_message',
            {
              userName: user.username,
              password: `<code>${user.password}</code>`,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_ai_dashboard_delete_token_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        ),
      );
  }

  closeModal() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::create-user::cancel`,
      type: 'action',
    });
    this.goBack();
  }
}
