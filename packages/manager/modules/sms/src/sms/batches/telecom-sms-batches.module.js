import angular from 'angular';
import '@uirouter/angularjs';

import history from './history';

import cancelComponent from './cancel/telecom-sms-batches-cancel.component';
import component from './telecom-sms-batches.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesModule';

angular
  .module(moduleName, [history])
  .component(cancelComponent.name, cancelComponent)
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
