import angular from 'angular';

import triStateCheckboxDirective from './triStateCheckbox-directive';

const moduleName = 'ua.triStateCheckbox';

angular
  .module(moduleName, [])
  .directive('triStateCheckbox', triStateCheckboxDirective);

export default moduleName;
