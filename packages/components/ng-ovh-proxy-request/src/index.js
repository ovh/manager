import angular from 'angular';

import provider from './provider';

const moduleName = 'ngOvhProxyRequest';

angular
  .module(moduleName, [])
  .provider('ovhProxyRequest', provider);

export default moduleName;
