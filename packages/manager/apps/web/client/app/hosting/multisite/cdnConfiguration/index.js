import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerHostingMultisiteCdnConfigurationLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.hosting.dashboard.multisite.cdnConfiguration.**',
      {
        url: '/cdnConfiguration',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import(
            './hosting-multisite-cdnConfiguration.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      },
    );
  },
);

export default moduleName;
