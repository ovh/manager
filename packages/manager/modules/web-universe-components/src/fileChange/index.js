import angular from 'angular';

import wucFileChangeDirective from './file-change.directive';

const moduleName = 'wucFileChange';

angular
  .module(moduleName, [])
  .directive('wucFileChange', wucFileChangeDirective);

export default moduleName;
