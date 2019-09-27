/**
 * Special redirections.
 */
angular.module('managerApp').run(($rootScope, $state) => {
  $rootScope.$on('$stateChangeSuccess', (e, state) => {
    // Default tab is the 'tokens' view of a project
    if (state.name === 'dbaas.dbaasts-project.dbaasts-project-details') {
      $state.go('.dbaasts-project-details-key');
    }
  });
});

angular.module('managerApp').config(($urlRouterProvider) => {
  // Redirect /paas/dbaas to /dbaas
  $urlRouterProvider.rule(($injector, $location) => {
    const path = $location.path();
    if (/^\/paas\/dbaas/.test(path)) {
      return path.replace('/paas/dbaas', '/dbaas');
    }
    return null;
  });
});
