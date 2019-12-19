
angular.module('managerApp').controller('DBaasTsProjectDetailsCtrl', function DBaasTsProjectDetailsCtrl($state) {
  const self = this;

  self.getRouteContext = function getRouteContext() {
    if ($state.includes('dbaas.dbaasts-project')) {
      return 'dbaas.dbaasts-project.dbaasts-project-details';
    }

    return '';
  };
});
