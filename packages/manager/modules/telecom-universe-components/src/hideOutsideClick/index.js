import angular from 'angular';

import tucHideOutsideClickDirective from './hide-outside-click.directive';

const moduleName = 'tucHideOutsideClick';

angular
  .module(moduleName, [])
  .directive('tucHideOutsideClick', tucHideOutsideClickDirective);

export default moduleName;
