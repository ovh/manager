angular.module('managerApp').component('cdaDetail', {
  templateUrl: 'app/cda/details/home/detail/cda-detail.component.html',
  bindings: {
    serviceId: '<',
    detail: '<',
    crushTunablesOptions: '<',
  },
});
