export default class IdentityCheckCtrl {
  /* @ngInject */
  constructor(coreURLBuilder, IdentityCheckService, TucToastError) {
    this.IdentityCheckService = IdentityCheckService;
    this.TucToastError = TucToastError;

    this.isMessageShown = false;
    this.identityCheckLink = coreURLBuilder.buildURL(
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
