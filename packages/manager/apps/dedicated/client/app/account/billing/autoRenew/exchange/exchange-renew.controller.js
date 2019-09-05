export default class ExchangeRenewCtrl {
  /* @ngInject */
  constructor($uibModalInstance, exchangeName, organization) {
    this.$uibModalInstance = $uibModalInstance;
    this.exchangeName = exchangeName;
    this.organization = organization;
  }
}

angular.module('Billing')
  .controller('ExchangeRenewCtrl', ExchangeRenewCtrl);
