angular.module('managerApp').run(($transitions, $rootScope, $state) => {
  $transitions.onSuccess({}, () => {
    if (!$state.includes('telecom')) {
      // eslint-disable-next-line no-param-reassign
      $rootScope.managerPreloadHide += ' manager-preload-hide';
    }
  });
});
