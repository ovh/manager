import angular from 'angular';

import incomingCalls from './incomingCalls';
import incomingFax from './incomingFax';

const moduleName = 'ovhManagerTelephonyConsumption';

angular.module(moduleName, [
  incomingCalls,
  incomingFax,
]);

export default moduleName;
