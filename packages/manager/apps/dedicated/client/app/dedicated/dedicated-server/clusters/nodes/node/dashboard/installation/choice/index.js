import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

const moduleName =
  'ovhManagerDedicatedClusterNodeDashboardServerInstallationChoice';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicated-cluster.cluster.node.dashboard.installation-choice.**',
      {
        url: '/installation/choice',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./choice.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
