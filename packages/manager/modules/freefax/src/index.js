import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import freefax from './freefax';

import { FREEFAX_AVAILABILITY } from './feature-availability/feature-availability.constants';

import 'ovh-manager-webfont/dist/css/ovh-font.css';

const moduleName = 'ovhManagerFreeFaxesLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', freefax]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('freefaxes', {
        url: '/freefax',
        abstract: true,
      })
      .state('freefaxes.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./freefax.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);

export default moduleName;
export { FREEFAX_AVAILABILITY };
