import angular from 'angular';
import '@uirouter/angularjs';

import component from './telecom-sms-batches-history.component';
import routing from './routing';
import deleteComponent from './delete';

const moduleName = 'ovhManagerSmsBatchesHistory';

angular
  .module(moduleName, ['ui.router', deleteComponent])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
