import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

const moduleName =
  'ovhManagerDedicatedClusterNodeDashboardServerInstallationProgress';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicated-cluster.cluster.node.dashboard.installation-progress.**',
      {
        url: '/installation/progress',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./progress.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
