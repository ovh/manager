const OutgoingTraficComponent = {
  templateUrl:
    'app/cloud/components/project/billing/outgoing-trafic/outgoing-trafic.component.html',
  controller: 'OutgoingTraficComponentCtrl',
  controllerAs: '$ctrl',
  bindings: {
    regions: '<',
  },
};
angular
  .module('managerApp')
  .component('outgoingTrafic', OutgoingTraficComponent);
