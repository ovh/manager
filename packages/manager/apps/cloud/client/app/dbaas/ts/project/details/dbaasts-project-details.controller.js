

angular.module('managerApp').controller('DBaasTsProjectDetailsCtrl', function ($state) {
  const self = this;

  self.getRouteContext = function () {
    if ($state.includes('dbaas.dbaasts-project')) {
      return 'dbaas.dbaasts-project.dbaasts-project-details';
    }

    return '';
  };
});
