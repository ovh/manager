import angular from 'angular';

import simpletooltipDirective from './simpletooltip-directive';
import simpletooltipPopupDirective from './simpletooltipPopup-directive';

const moduleName = 'ua.popover.simpletooltip';

angular
  .module(moduleName, [])
  .directive('simpletooltipPopup', simpletooltipPopupDirective)
  .directive('simpletooltip', simpletooltipDirective);

export default moduleName;
