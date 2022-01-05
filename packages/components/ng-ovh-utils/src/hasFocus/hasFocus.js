import angular from 'angular';

import hasFocusDirective from './hasFocus-directive';

const moduleName = 'ua.hasFocus';

angular.module(moduleName, []).directive('hasFocus', hasFocusDirective);

export default moduleName;
