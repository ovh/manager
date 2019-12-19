
angular.module('managerApp').controller('DBaasTsProjectCtrl',
  function DBaasTsProjectCtrl($scope, $state) {
    const self = this;

    self.loaders = {
      project: false,
    };

    self.model = {
      project: null,
    };

    self.includes = function includes(stateName) {
      return $state.includes(stateName);
    };
  });
