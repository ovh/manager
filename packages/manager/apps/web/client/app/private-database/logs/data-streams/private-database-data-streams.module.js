import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './private-database-data-streams.component';
import routing from './private-database-data-streams.routing';

const moduleName = 'ovhManagerPrivateDatabaseDataStreams';
angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('privateDatabaseDataStreams', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
