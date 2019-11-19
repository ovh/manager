import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import freefax from './freefax';

const moduleName = 'ovhManagerFreeFaxes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    freefax,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('freefaxes', {
      url: '/freefax',
      abstract: true,
    });
  });

export default moduleName;
