import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default /* @ngInject */ function (OvhApiMeBill, TucToastError) {
  const self = this;

  self.links = {
    billing: buildURL('dedicated', '#/billing/history'),
  };
  self.amountBillsDisplayed = 6;

  self.$onInit = function getLastBills() {
    return OvhApiMeBill.Aapi()
      .last()
      .$promise.then(
        (bills) => {
          self.lastBills = bills;
        },
        (err) => {
          self.lastBills = [];
          return TucToastError(err);
        },
      );
  };
}
