import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'oclazyload';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

const moduleName = 'ovhManagerDedicatedServerLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', ngOvhFeatureFlipping])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('app.dedicated-server.**', {
          url: '/server',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./dedicated-server.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('app.dedicated-cluster.**', {
          url: '/cluster',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./dedicated-server.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });

      $urlRouterProvider.when(/^\/configuration\/server/, () => {
        window.location.href = window.location.href.replace(
          '/configuration/server',
          '/server',
        );
      });

      $urlRouterProvider.when(/^\/configuration\/servers/, () => {
        window.location.href = window.location.href.replace(
          '/configuration/servers',
          '/server',
        );
      });

      $urlRouterProvider.when(/^\/configuration\/clusters/, () => {
        window.location.href = window.location.href.replace(
          '/configuration/clusters',
          '/cluster',
        );
      });

      $urlRouterProvider.when(/^\/configuration\/cluster/, () => {
        window.location.href = window.location.href.replace(
          '/configuration/cluster',
          '/cluster',
        );
      });

      // Redirect to dedicated-server uapp if available
      $urlRouterProvider.rule(($injector, $location) => {
        const path = $location.path();
        if (['/server', '/cluster'].includes(path)) {
          const ovhFeatureFlipping = $injector.get('ovhFeatureFlipping');
          const shellClient = $injector.get('shellClient');
          Promise.all([
            shellClient.navigation.getURL('dedicated-servers', '#/'),
            ovhFeatureFlipping.checkFeatureAvailability(['dedicated-servers']),
          ]).then(([url, featureAvailability]) => {
            if (featureAvailability.isFeatureAvailable('dedicated-servers')) {
              window.top.location.href = url;
            }
          });
        }
        return undefined;
      });
    },
  );

export default moduleName;
