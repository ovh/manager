import angular from 'angular';
import '@uirouter/angularjs';

import cancelComponent from './cancel/telecom-sms-batches-cancel.component';
import component from './telecom-sms-batches.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesModule';

angular
  .module(moduleName, [])
  .component(cancelComponent.name, cancelComponent)
  .component(component.name, component)
  .config(routing);

export default moduleName;
