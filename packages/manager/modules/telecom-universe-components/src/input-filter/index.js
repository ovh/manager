import angular from 'angular';

import tucInputFilterDirective from './input-filter.directive';

const moduleName = 'tucInputFilter';

angular
  .module(moduleName, [])
  .directive('tucInputFilter', tucInputFilterDirective);

export default moduleName;
