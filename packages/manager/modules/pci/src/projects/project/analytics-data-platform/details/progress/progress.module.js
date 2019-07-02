import angular from 'angular';
import '@uirouter/angularjs';
import routing from './progress.routing';

import progressComponent from './progress.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformProgressComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('progressComponent', progressComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
