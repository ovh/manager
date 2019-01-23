import angular from 'angular';

import incomingCalls from './incomingCalls';
import incomingFax from './incomingFax';
import outgoingCalls from './outgoingCalls';
import outgoingFax from './outgoingFax';

const moduleName = 'ovhManagerTelephonyConsumption';

angular.module(moduleName, [
  incomingCalls,
  incomingFax,
  outgoingCalls,
  outgoingFax,
]);

export default moduleName;
