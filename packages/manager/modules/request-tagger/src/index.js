import angular from 'angular';
import set from 'lodash/set';
import '@uirouter/angularjs';

import factory from './factory';
import { DEFAULT_PAGE, HEADER_NAVIGATION_ID, HEADER_PAGE } from './constants';

const moduleName = 'ngOvhRequestTagger';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($httpProvider) => {
      set(
        $httpProvider.defaults.headers.common,
        HEADER_NAVIGATION_ID,
        Date.now().toString(36),
      );
      set($httpProvider.defaults.headers.common, HEADER_PAGE, DEFAULT_PAGE);
    },
  )
  .factory('OvhNgRequestTaggerInterceptor', factory)
  .run(
    /* @ngInject */ ($transitions, $http) => {
      $transitions.onBefore({}, (transition) => {
        set($http.defaults.headers.common, HEADER_PAGE, transition.to().name);
      });
    },
  );

export default moduleName;
