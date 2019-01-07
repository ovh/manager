import angular from 'angular';

import provider from './provider';

const moduleName = 'ngOvhHttp';

angular
  .module(moduleName, [])
  .provider('OvhHttp', provider);

export default moduleName;
