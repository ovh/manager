import angular from 'angular';
import '@uirouter/angularjs';

import flagsComponent from './flags.component';

const moduleName =
  'enterpriseCloudDatabaseServiceConnectionDetailsFlagsComponent';

angular
  .module(moduleName, ['ui.router'])
  .component(
    'enterpriseCloudDatabaseServiceConnectionDetailsFlagsComponent',
    flagsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
