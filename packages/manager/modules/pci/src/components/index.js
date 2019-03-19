import angular from 'angular';

import project from './project';
import runabove from './runabove';
import writeRightRequired from './writeRightRequired';

// import './index.less';

const moduleName = 'ovhManagerPciComponents';

angular
  .module(moduleName, [
    project,
    runabove,
    writeRightRequired,
  ]);

export default moduleName;
