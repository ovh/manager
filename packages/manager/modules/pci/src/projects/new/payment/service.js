export default class PciProjectNewPaymentService {
  /* @ngInject */
  constructor(OvhApiMeVoucherAccount) {
    this.OvhApiMeVoucherAccount = OvhApiMeVoucherAccount;
  }

  getDlpStatus() {
    return this.OvhApiMeVoucherAccount
      .v6()
      .get({
        voucherAccountId: 'digitallaunchpad',
      })
      .$promise;
  }
}
