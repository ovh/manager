import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import onboarding from './onboarding';

import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerOfficeLicensesLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'ngUiRouterBreadcrumb',
    'oc.lazyLoad',
    onboarding,
  ])
  .config(
    /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
      $stateProvider
        .state('office', {
          url: '/office/license',
          template: '<div ui-view></div>',
          redirectTo: 'office.index',
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('office_title'),
        })
        .state('office.index.**', {
          url: '',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./office.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        })
        .state('office.product.**', {
          url: '/:serviceName',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

            return import('./dashboard/microsoft.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        });

      $urlRouterProvider.when(
        /^\/configuration\/microsoft\/office\/license/,
        /* @ngInject */ ($location) => {
          $location.url(
            $location.url().replace('/configuration/microsoft', ''),
          );
        },
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
