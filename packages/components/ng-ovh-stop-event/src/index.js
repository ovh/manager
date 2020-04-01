import angular from 'angular';

import directive from './directive';

const moduleName = 'ngOvhStopEvent';

angular.module(moduleName, []).directive('ovhStopEvent', directive);

export default moduleName;
