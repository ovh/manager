import angular from 'angular';

import component from './overTheBox-configure.component';
import routing from './overTheBox-configure.routing';

const moduleName = 'ovhManagerOtbConfigure';

angular
  .module(moduleName, [])
  .config(routing)
  .component('overTheBoxConfigure', component);

export default moduleName;
