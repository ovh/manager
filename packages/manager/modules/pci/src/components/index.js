import angular from 'angular';

import runabove from './runabove';
import writeRightRequired from './writeRightRequired';

import './index.less';

const moduleName = 'ovhManagerPciComponents';

angular
  .module(moduleName, [
    runabove,
    writeRightRequired,
  ]);

export default moduleName;
