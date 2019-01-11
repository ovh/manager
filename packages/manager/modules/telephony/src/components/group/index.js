
import angular from 'angular';

import groupFactory from './telephony-group.factory';
import groupLineFactory from './line/group-line.factory';

const moduleName = 'ovhManagerTelephonyGroup';

angular.module(moduleName, [])
  .factory('TelephonyGroup', groupFactory)
  .factory('TelephonyGroupLine', groupLineFactory);

export default moduleName;
