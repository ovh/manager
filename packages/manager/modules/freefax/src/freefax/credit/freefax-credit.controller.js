import head from 'lodash/head';

export default /* @ngInject */ function (
  OvhApiFreeFax,
  TucToastError,
  FREEFAX_DISCRETE_CREDIT,
) {
  const self = this;

  function init() {
    self.cost = '';
    self.contracts = [];

    self.creditChoices = FREEFAX_DISCRETE_CREDIT.map((val) => ({
      label: val,
      value: val,
    }));

    self.orderDone = false;
    self.bill = null;
    self.quantity = null;
  }

  self.getPrice = function getPrice(amount) {
    self.contracts = [];
    self.cost = null;
    OvhApiFreeFax.v6()
      .getPrice({
        quantity: amount,
      })
      .$promise.then(
        (data) => {
          self.cost = data.prices;
          const detail = head(data.details);
          self.quantity = detail.quantity;
          self.contracts = data.contracts;
        },
        (err) => {
          self.cost = '';
          return new TucToastError(err);
        },
      );
  };

  self.order = function order(amount) {
    self.orderDone = true;
    OvhApiFreeFax.v6()
      .orderCredits(null, {
        quantity: amount,
      })
      .$promise.then(
        (response) => {
          const detail = head(response.details);
          self.bill = {
            url: response.url,
            total: response.prices.withTax.text,
            id: response.orderId,
            quantity: detail.quantity,
          };
        },
        (err) => {
          init();
          return new TucToastError(err);
        },
      );
  };

  init();
}
