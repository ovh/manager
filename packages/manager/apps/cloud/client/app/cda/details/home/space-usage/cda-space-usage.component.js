angular.module('managerApp').component('cdaSpaceUsage', {
  templateUrl:
    'app/cda/details/home/space-usage/cda-space-usage.component.html',
  bindings: {
    total: '<',
    available: '<',
    used: '<',
  },
});
