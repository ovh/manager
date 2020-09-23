import angular from 'angular';
import '@uirouter/angularjs';

import cancel from './cancel';
import component from './telecom-sms-batches-pending.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesPendingModule';

angular
  .module(moduleName, ['ui.router', cancel])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
