import angular from 'angular';

import linkedpopoverDirective from './linkedpopover-directive';
import linkedpopoverPopupDirective from './linkedpopoverPopup-directive';

const moduleName = 'ua.popover.linkedpopover';

angular
  .module(moduleName, [])
  .directive('linkedpopover', linkedpopoverDirective)
  .directive('linkedpopoverPopup', linkedpopoverPopupDirective);

export default moduleName;
