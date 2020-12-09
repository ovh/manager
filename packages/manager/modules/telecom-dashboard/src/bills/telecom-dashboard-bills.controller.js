import constant from '../telecom-dashboard.constant';

export default /* @ngInject */ function (OvhApiMeBill, TucToastError) {
  const self = this;

  self.links = {
    billing: constant.billing,
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
