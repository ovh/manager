const AdditionalServicesComponent = {
  templateUrl:
    'app/cloud/components/project/billing/additional-services/additional-services.component.html',
  controller: 'AdditionalServicesComponentCtrl',
  controllerAs: '$ctrl',
  bindings: {
    services: '<',
    currencySymbol: '<',
  },
};
angular
  .module('managerApp')
  .component('additionalServices', AdditionalServicesComponent);
