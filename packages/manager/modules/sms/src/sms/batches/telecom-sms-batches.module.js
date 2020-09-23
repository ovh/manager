import angular from 'angular';
import '@uirouter/angularjs';

import details from './details';
import history from './history';
import pending from './pending';
import statistics from './statistics';

import cancelComponent from './cancel/telecom-sms-batches-cancel.component';
import component from './telecom-sms-batches.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesModule';

angular
  .module(moduleName, [details, history, pending, statistics])
  .component(cancelComponent.name, cancelComponent)
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
