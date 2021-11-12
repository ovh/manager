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
    this.IdentityCheckService.isIdentityChecked()
      .then((isIdentityChecked) => {
        this.isMessageShown = !isIdentityChecked;
      })
      .catch((error) => {
        this.TucToastError(error.data?.message || error.message);
      });
  }
}
