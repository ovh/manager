import angular from 'angular';
import 'angular-translate';

import component from './history.component';
import routing from './history.routing';

const moduleName = 'ovhManagerWebDomainZoneHistoryModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('domainZoneHistory', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
