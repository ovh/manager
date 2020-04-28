import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import overTheBox from './overthebox';

import { OTB_AVAILABILITY } from './feature-availability/feature-availability.constants';

const moduleName = 'ovhManagerOverTheBoxesLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', overTheBox]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('overTheBoxes', {
        url: '/overTheBox',
        abstract: true,
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
