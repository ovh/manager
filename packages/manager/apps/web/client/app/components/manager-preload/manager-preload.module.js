angular.module('App').run(($rootScope, $state, $transitions) => {
  $transitions.onSuccess({}, () => {
    if (!$state.includes('app')) {
      // eslint-disable-next-line no-param-reassign
      $rootScope.managerPreloadHide += ' manager-preload-hide';
    }
  });
});
