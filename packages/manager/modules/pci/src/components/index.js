import angular from 'angular';

import runabove from './runabove';
import project from './project';
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
