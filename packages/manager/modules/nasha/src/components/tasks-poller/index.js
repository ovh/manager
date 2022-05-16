import angular from 'angular';

import component from './tasks-poller.component';

const moduleName = 'ovhManagerNashaComponentsTasksPoller';

angular
  .module(moduleName, [])
  .component('nashaComponentsTasksPoller', component);

export default moduleName;
