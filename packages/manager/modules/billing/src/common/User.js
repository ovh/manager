export default /* @ngInject */ function BillingUserService(
  $q,
  coreConfig,
  OvhHttp,
) {
  /*
   * get user by SWS
   */
  this.getUser = () =>
    this.getMe().then((result) => ({
      nichandle: result.nichandle,
      email: result.email,
      firstName: result.firstname,
      lastName: result.name,
      billingCountry: result.country,
      ovhSubsidiary: result.ovhSubsidiary,
      spareEmail: result.spareEmail,
    }));

  this.getMe = () => $q.when(coreConfig.getUser());

  this.isVATNeeded = () =>
    this.getUser().then(
      (user) => ['CA', 'QC', 'WE', 'WS'].indexOf(user.ovhSubsidiary) === -1,
    );

  this.addCreditCode = (inputCode) =>
    OvhHttp.post('/me/credit/code', {
      rootPath: 'apiv6',
      data: {
        inputCode,
      },
    });
}
