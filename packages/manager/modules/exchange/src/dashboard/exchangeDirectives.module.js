import angular from 'angular';

import officeAttach from '../office-attach/office-attach.directive';

const moduleName = 'Module.exchange.directives';

angular.module(moduleName, []).directive('officeAttach', officeAttach);

export default moduleName;
