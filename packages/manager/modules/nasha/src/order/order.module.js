import angular from 'angular';

import routing from './order.routing';
import component from './order.component';

const moduleName = 'ovhManagerNashaOrder';

angular
  .module(moduleName, [])
  .component('nashaOrder', component)
  .config(routing);

export default moduleName;
