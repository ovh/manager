

angular.module('managerApp').controller('DBaasTsProjectCtrl',
  function ($scope, $state) {
    const self = this;

    self.loaders = {
      project: false,
    };

    self.model = {
      project: null,
    };

    self.includes = function (stateName) {
      return $state.includes(stateName);
    };
  });
