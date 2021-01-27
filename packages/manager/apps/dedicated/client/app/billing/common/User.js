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

  this.getAvailableMeans = () =>
    OvhHttp.get('/me/availableAutomaticPaymentMeans', {
      rootPath: 'apiv6',
    }).then((result) => {
      const means = [];

      /* Actually, the means is a simple list: ["mean1", "mean2", …]
       * but this "api end point" retrun an object: {"mean1": true, "mean2": true, …}
       * for compatibility, keep the simple list presentation */
      if (result && result && angular.isObject(result)) {
        /* eslint-disable no-restricted-syntax */
        for (const mean in result) {
          if (result[mean]) {
            means.push(mean);
          }
        }
        /* eslint-enable no-restricted-syntax */
      }
      return means;
    });

  this.addCreditCode = (inputCode) =>
    OvhHttp.post('/me/credit/code', {
      rootPath: 'apiv6',
      data: {
        inputCode,
      },
    });
}
