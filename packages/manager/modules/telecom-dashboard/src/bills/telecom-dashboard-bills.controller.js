import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default /* @ngInject */ function(BillsService, TucToastError) {
  const self = this;

  self.links = {
    billing: buildURL('dedicated', '#/billing/history'),
  };
  self.amountBillsDisplayed = 6;

  self.$onInit = function getLastBills() {
    self.lastBills = [];
    BillsService.getLastBills()
      .then(({ data }) => {
        self.lastBills = data;
      })
      .catch(({ data }) => {
        TucToastError(data.message);
      });
  };
}
