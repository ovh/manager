import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerCdnDomainsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.networks.cdn.dedicated.manage.domain', {
        url: '/domain',
        redirectTo: 'app.networks.cdn.dedicated.manage.domain.index',
        views: {
          cdnView: {
            template: '<div ui-view></div>',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('cdn_dedicated_domains'),
        },
      });

      $stateProvider.state(
        'app.networks.cdn.dedicated.manage.domain.index.**',
        {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./domains.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
