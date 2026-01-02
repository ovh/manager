import { User } from '@ovh-ux/manager-models';

export default /* @ngInject */ function BillingUserService(
  $q,
  coreConfig,
  OvhHttp,
) {
  /*
   * get user by SWS
   */
  this.getUser = () =>
    this.getMe().then(
      (result) =>
        new User(
          {
            ...result,
            firstName: result.firstname,
            lastName: result.name,
            billingCountry: result.country,
          },
          result.certificates,
        ),
    );

  this.getMe = () => $q.when(coreConfig.getUser());

  this.isVATNeeded = () => this.getUser().then((user) => user.isVATNeeded);

  this.addCreditCode = (inputCode) =>
    OvhHttp.post('/me/credit/code', {
      rootPath: 'apiv6',
      data: {
        inputCode,
      },
    });
}
