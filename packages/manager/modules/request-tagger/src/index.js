import angular from 'angular';
import '@uirouter/angularjs';

import {
  Header,
  addHeadersOverride,
  defineCurrentPage,
} from '@ovh-ux/request-tagger';

import factory from './factory';

const moduleName = 'ngOvhRequestTagger';

angular
  .module(moduleName, ['ui.router'])
  .factory('OvhNgRequestTaggerInterceptor', factory)
  .config(() => {
    addHeadersOverride('^/engine/2api/service', {
      [Header.PAGE]: 'sidebar',
    });
  })
  .run(
    /* @ngInject */ ($transitions) => {
      $transitions.onBefore({}, (transition) => {
        defineCurrentPage(transition.to().name);
      });
    },
  );

export default moduleName;
