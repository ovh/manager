import angular from 'angular';

import directive from './directive';

const moduleName = 'cucSmoothScrollHere';

angular.module(moduleName, []).directive('cucSmoothScrollHere', directive);

export default moduleName;
