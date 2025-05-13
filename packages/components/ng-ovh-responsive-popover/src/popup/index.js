import angular from 'angular';

import directive from './directive';

const moduleName = 'ngOvhResponsivePopoverPopup';

angular.module(moduleName, []).directive('responsivePopoverPopup', directive);

export default moduleName;
