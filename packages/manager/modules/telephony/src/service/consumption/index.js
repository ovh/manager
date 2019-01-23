import angular from 'angular';

import incomingCalls from './incomingCalls';
import incomingFax from './incomingFax';
import outgoingCalls from './outgoingCalls';

const moduleName = 'ovhManagerTelephonyConsumption';

angular.module(moduleName, [
  incomingCalls,
  incomingFax,
  outgoingCalls,
]);

export default moduleName;
