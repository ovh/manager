import angular from 'angular';

import wucOvhFilereaderDirective from './ovhFileReader.directive';

const moduleName = 'wucOvhFileReader';

angular
  .module(moduleName, [])
  .directive('wucOvhFilereader', wucOvhFilereaderDirective);

export default moduleName;
