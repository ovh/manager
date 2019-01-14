import angular from 'angular';

import groupFactory from './telephony-group.factory';
import consumptionPieChart from './consumption/pie-chart';
import fax from './fax';
import line from './line';
import number from './number';

const moduleName = 'ovhManagerTelephonyGroup';

angular.module(moduleName, [
  consumptionPieChart,
  fax,
  line,
  number,
])
  .factory('TelephonyGroup', groupFactory);

export default moduleName;
