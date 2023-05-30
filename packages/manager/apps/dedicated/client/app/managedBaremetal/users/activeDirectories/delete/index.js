import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'managedBaremetalUsersActiveDirectoriesDeleteLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.users.federation-delete.**',
      {
        url: '/federation/delete',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./federation-delete.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
