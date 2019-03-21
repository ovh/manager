import angular from 'angular';

import directive from './directive';

const moduleName = 'ovhManagerPciComponentsRunaboveScrollHere';

angular
  .module(moduleName, [])
  .directive('scrollHere', directive);

export default moduleName;
