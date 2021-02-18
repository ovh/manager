import angular from 'angular';

import directive from './directive';

const moduleName = 'cucClickEnterOnKeypress';

angular.module(moduleName, []).directive('cucClickEnterOnKeypress', directive);

export default moduleName;
