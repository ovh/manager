import angular from 'angular';
import '@uirouter/angularjs';

import component from './telecom-sms-batches.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesModule';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(routing);

export default moduleName;
