import angular from 'angular';
import '@uirouter/angularjs';
import nodesComponent from './nodes.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformDeployNodesComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('nodesComponent', nodesComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
