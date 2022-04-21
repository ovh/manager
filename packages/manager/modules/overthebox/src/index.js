import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import overTheBox from './overthebox';

import { OTB_AVAILABILITY } from './feature-availability/feature-availability.constants';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerOverTheBoxLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', overTheBox]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('overTheBoxes', {
        url: '/overTheBox',
        redirectTo: 'overTheBoxes.index',
        resolve: {
          breadcrumb: () => 'OverTheBox',
        },
      })
      .state('overTheBoxes.onboarding.**', {
        url: '/onboarding',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./onboarding/onboarding.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state('overTheBoxes.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./overtheboxes.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);

export default moduleName;

export { OTB_AVAILABILITY };
