import angular from 'angular';

import hasFocusDirective from './has-focus.directive';

const moduleName = 'ovhManagerAnthosDashboardComponentHasFocus';

angular.module(moduleName, []).directive('hasFocus', hasFocusDirective);

export default moduleName;
