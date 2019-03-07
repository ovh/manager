import angular from 'angular';

import directive from './directive';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciComponentsRunaboveFilelistener';

angular
  .module(moduleName, [])
  .directive('filelistener', directive);

export default moduleName;
