const AUTORENEW_2016_SUBSIDIARIES = [
  'FR',
  'CA',
  'QC',
  'WE',
  'WS',
  'ASIA',
  'SG',
  'AU',
];

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
      canHaveInvoicesByPostalMail: () =>
        result.billingCountry === 'FR' && result.legalform === 'individual',
      hasAutorenew2016: () =>
        AUTORENEW_2016_SUBSIDIARIES.includes(result.ovhSubsidiary),
      auth: result.auth,
      language: result.language,
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
