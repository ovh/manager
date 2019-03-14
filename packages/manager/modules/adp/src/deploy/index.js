import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import nodesTemplate from './nodes.html';

const moduleName = 'ovhManagerAdpDeploy';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('adp.deploy.**', {
      url: '/deploy',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./deploy.component')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  }).run(/* @ngInject */($templateCache) => {
    // import templates required by ng-include
    $templateCache.put('adp/deploy/nodes.html', nodesTemplate);
  });

export default moduleName;
