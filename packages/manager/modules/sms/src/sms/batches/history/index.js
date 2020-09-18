import angular from 'angular';
import '@uirouter/angularjs';

import component from './telecom-sms-batches-history.component';
import routing from './routing';

import cancelBatch from './cancel';

const moduleName = 'ovhManagerSmsBatchesHistory';

angular
  .module(moduleName, [cancelBatch, 'ui.router'])
  .component(component.name, component)
  .config(routing);

export default moduleName;
