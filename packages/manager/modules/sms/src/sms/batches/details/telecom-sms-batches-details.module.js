import angular from 'angular';
import '@uirouter/angularjs';

import component from './telecom-sms-batches-details.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesDetailsModule';

angular
  .module(moduleName, ['ui.router'])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
