import angular from 'angular';

import directive from './directive';

const moduleName = 'cucAutoselect';

angular.module(moduleName, []).directive('cucAutoselect', directive);

export default moduleName;
