import angular from 'angular';
import '@uirouter/angularjs';

import component from './telecom-sms-batches-history-cancel.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsBatcheshistoryCancel';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(routing);

export default moduleName;
