import angular from 'angular';

import incomingCalls from './incomingCalls';

const moduleName = 'ovhManagerTelephonyConsumption';

angular.module(moduleName, [
  incomingCalls,
]);

export default moduleName;
