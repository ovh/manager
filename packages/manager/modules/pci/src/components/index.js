import angular from 'angular';

import cucConsumption from './consumption';
import cucCurrency from './currency';
import project from './project';
import runabove from './runabove';
import writeRightRequired from './writeRightRequired';

const moduleName = 'ovhManagerPciComponents';

angular.module(moduleName, [
  cucConsumption,
  cucCurrency,
  project,
  runabove,
  writeRightRequired,
]);

export default moduleName;
