export default class IdentityCheckMessageCtrl {
  /* @ngInject */
  constructor(coreURLBuilder, IdentityCheckService, TucToastError) {
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
      })
      .catch((error) => {
        this.TucToastError(error.data?.message || error.message);
      });
  }
}
