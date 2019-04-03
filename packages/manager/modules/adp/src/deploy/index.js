import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import generalTemplate from './general.html';
import nodesTemplate from './nodes.html';
import regionsTemplate from './regions.html';
import reviewTemplate from './review.html';
import storageTemplate from './storage.html';
import securityTemplate from './security.html';

const moduleName = 'ovhManagerAdpDeploy';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp.deploy.**', {
      url: '/deploy',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./deploy.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  }).run(/* @ngInject */($templateCache) => {
    // import templates required by ng-include
    $templateCache.put('adp/deploy/nodes.html', nodesTemplate);
    $templateCache.put('adp/deploy/general.html', generalTemplate);
    $templateCache.put('adp/deploy/regions.html', regionsTemplate);
    $templateCache.put('adp/deploy/review.html', reviewTemplate);
    $templateCache.put('adp/deploy/storage.html', storageTemplate);
    $templateCache.put('adp/deploy/security.html', securityTemplate);
  });

export default moduleName;
