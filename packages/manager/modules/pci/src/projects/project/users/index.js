/**
 * This section has been migrated to a React µapp.
 * Please see : packages/manager/apps/pci-users
 */
import angular from 'angular';
import '@uirouter/angularjs';

const moduleName = 'ovhManagerPciUsers';

/**
 * The base routing is kept so that existing angularjs code using
 * state.go('pci.projects.project.users') will still work as expected.
 * The redirection to the µapp from this state is handled automatically
 * by the container & the shell.
 */
angular.module(moduleName, ['ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('pci.projects.project.users', {
      url: '/users',
    });
  },
);

export default moduleName;
