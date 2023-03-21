export default class AIDashboadDeleteTokenCtrl {
  /* @ngInject */
  constructor($translate, atInternet, AiDashboardService) {
    this.AiDashboardService = AiDashboardService;
    this.atInternet = atInternet;
    this.$translate = $translate;
  }

  deleteToken() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::delete-token::validate`,
      type: 'action',
    });
    this.processing = true;
    return this.AiDashboardService.deleteToken(this.projectId, this.token.id)
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_ai_dashboard_delete_token_success_message',
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

  cancel() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::delete-token::cancel`,
      type: 'action',
    });
    this.goBack();
  }
}
