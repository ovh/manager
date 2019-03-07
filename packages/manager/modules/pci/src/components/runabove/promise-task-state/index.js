import angular from 'angular';

import component from './component';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciComponentsRunabovePromiseTastState';

angular
  .module(moduleName, [])
  .component('promiseTaskState', component);

export default moduleName;
