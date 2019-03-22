import angular from 'angular';

import directive from './directive';

const moduleName = 'ovhManagerPciComponentsRunaboveFilelistener';

angular
  .module(moduleName, [])
  .directive('filelistener', directive);

export default moduleName;
