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
    this.IdentityCheckService.isProcedureRequired()
      .then((isProcedureRequired) => {
        this.isMessageShown = isProcedureRequired;
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
      click: {
        campaignId: '[telecom-manager-migration]',
        creation: '[identity-check]',
        detailedPlacement: '[telecom::dashboard]',
      },
    });
  }
}
