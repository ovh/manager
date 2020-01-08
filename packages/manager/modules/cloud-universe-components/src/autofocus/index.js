import angular from 'angular';

import directive from './directive';

const moduleName = 'cucAutofocus';

angular.module(moduleName, []).directive('cucAutofocus', directive);

export default moduleName;
