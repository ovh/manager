import angular from 'angular';

import directive from './directive';

const moduleName = 'ngOvhResponsivePopoverClass';

angular.module(moduleName, []).directive('responsivePopoverClass', directive);

export default moduleName;
