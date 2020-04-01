import angular from 'angular';

import provider from './provider';
import component from './component';

const moduleName = 'ngOvhDocUrl';

angular
  .module(moduleName, [])
  .component('ovhDocUrl', component)
  .provider('ovhDocUrl', provider);

export default moduleName;
