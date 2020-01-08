import angular from 'angular';
import '@uirouter/angularjs';

import connectionDetailsComponent from './connection-details.component';
import flags from './flags';

const moduleName = 'enterpriseCloudDatabaseServiceConnectionDetailsComponent';

angular
  .module(moduleName, ['ui.router', flags])
  .component(
    'enterpriseCloudDatabaseServiceConnectionDetailsComponent',
    connectionDetailsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
