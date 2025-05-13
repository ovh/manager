export default class AIDashboadCreateTokenCtrl {
  /* @ngInject */
  constructor($translate, atInternet, AiDashboardService) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.AiDashboardService = AiDashboardService;
  }

  $onInit() {
    this.processing = false;
    this.model = {
      name: null,
      labelSelector: this.labelSelector,
      role: null,
      region: null,
    };
  }

  addToken() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::create-token::validate`,
      type: 'action',
    });
    this.processing = true;
    return this.AiDashboardService.addToken(this.projectId, this.model)
      .then((token) =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_ai_dashboard_create_token_add_success',
            {
              token: `<code>${token.status.value}</code>`,
            },
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant('pci_ai_dashboard_create_token_add_error', {
            message: err.data?.message || null,
          }),
          'error',
        ),
      );
  }

  closeModal() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::users-tokens::create-token::cancel`,
      type: 'action',
    });
    this.goBack();
  }
}
