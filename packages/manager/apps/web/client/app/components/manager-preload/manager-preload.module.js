angular.module('App').run(($rootScope, $state, $transitions) => {
  $transitions.onSuccess({}, () => {
    if (!$state.includes('app')) {
      $rootScope.managerPreloadHide += ' manager-preload-hide'; // eslint-disable-line no-param-reassign
    }
  });
});
