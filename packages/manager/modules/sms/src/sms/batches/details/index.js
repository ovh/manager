import angular from 'angular';
import '@uirouter/angularjs';

import component from './telecom-sms-batches-details.component';
import routing from './routing';

import deleteModule from './delete';

const moduleName = 'ovhManagerSmsBatchesHistoryDetails';

angular
  .module(moduleName, [deleteModule, 'ui.router'])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
