import angular from 'angular';

import simplepopoverDirective from './simplepopover-directive';
import simplepopoverPopupDirective from './simplepopoverPopup-directive';

const moduleName = 'ua.popover.simplepopover';

angular
  .module(moduleName, [])
  .directive('simplepopover', simplepopoverDirective)
  .directive('simplepopoverPopup', simplepopoverPopupDirective);

export default moduleName;
