import template from './CONSUMPTION.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('office.product.consumption', {
    url: '/consumption',
    template,
    controller: 'MicrosoftOfficeLicenseConsumptionCtrl',
    controllerAs: 'consumptionCtrl',
  });
};
