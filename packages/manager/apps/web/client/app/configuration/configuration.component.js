angular.module('App').component('configuration', {
  bindings: {
    user: '<',
  },
  controller: 'configurationCtrl',
  templateUrl: 'configuration/configuration.html',
});
