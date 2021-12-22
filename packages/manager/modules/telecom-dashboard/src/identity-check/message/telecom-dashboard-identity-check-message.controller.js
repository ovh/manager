export default class IdentityCheckMessageCtrl {
  /* @ngInject */
  constructor(atInternet, coreURLBuilder, IdentityCheckService, TucToastError) {
    this.atInternet = atInternet;
    this.IdentityCheckService = IdentityCheckService;
    this.TucToastError = TucToastError;

    this.isMessageShown = false;
    this.identityCheckFormLink = coreURLBuilder.buildURL(
      'telecom',
      '#/identity-check',
    );
  }

  $onInit() {
    this.IdentityCheckService.isIdentityChecked()
      .then((isIdentityChecked) => {
        this.isMessageShown = !isIdentityChecked;
        // tracking impression message
        if (this.isMessageShown) {
          this.atInternet.trackImpression({
            campaignId: '[telecom-manager-migration]',
            creation: '[identity-check]',
            detailedPlacement: '[telecom::dashboard]',
          });
        }
      })
      .catch((error) => {
        this.TucToastError(error.data?.message || error.message);
      });
  }

  trackingImpressionClick() {
    this.atInternet.trackClickImpression({
      campaignId: '[telecom-manager-migration]',
      creation: '[identity-check]',
      detailedPlacement: '[telecom::dashboard]',
    });
  }
}
