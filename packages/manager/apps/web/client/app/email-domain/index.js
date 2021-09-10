import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerEmailDomainLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider.state('app.email', {
        url: '/email_domain',
        template: '<div ui-view></div>',
        resolve: {
          breadcrumb: () => 'Emails',
        },
      });

      $stateProvider.state('app.email.domain.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./email.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(
        /^\/configuration\/email-domain/,
        /* @ngInject */ ($location) => {
          $location.url($location.url().replace('/configuration', ''));
        },
      );

      $stateProvider.state('app.email-delegate', {
        url: '/email_delegate',
        template: '<div ui-view></div>',
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('emails_domain_delegate_title'),
        },
      });

      $stateProvider.state('app.email-delegate.dashboard.**', {
        url: '/:productId',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./email.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });

      $urlRouterProvider.when(
        /^\/configuration\/email-delegate/,
        /* @ngInject */ ($location) => {
          $location.url($location.url().replace('/configuration', ''));
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
