import angular from 'angular';

import liveCalls from './liveCalls';
import members from './members';
import records from './records';
import svaGenerator from './svaGenerator';

const moduleName = 'ovhManagerTelephonyAlias';

angular.module(moduleName, [
  liveCalls,
  members,
  records,
  svaGenerator,
]);

export default moduleName;
