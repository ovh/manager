import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDedicatedAccountUserLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('account.user.**', {
      url: '/useraccount',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          /* webpackChunkName: "user" */ './user.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);

export default moduleName;
