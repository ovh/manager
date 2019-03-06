import angular from 'angular';

import component from './component';

import './index.less';

const moduleName = 'ovhManagerPciComponentsRunabovePromiseTastState';

angular
  .module(moduleName, [])
  .component('promiseTaskState', component);

export default moduleName;
