angular.module('managerApp').run(($transitions, $rootScope, $state) => {
  $transitions.onSuccess({}, () => {
    if (!$state.includes('telecom')) {
      $rootScope.managerPreloadHide += ' manager-preload-hide'; // eslint-disable-line
    }
  });
});
