import angular from 'angular';

import calls from './callsFiltering';
import lines from './lines';
import scheduler from './scheduler';
import sounds from './sounds';
import timeCondition from './timeCondition';

const moduleName =
  'ovhManagerTelecomTelephonyAliasConfigurationFeatureContactCenterSolution';

angular.module(moduleName, [calls, lines, scheduler, sounds, timeCondition]);

export default moduleName;
