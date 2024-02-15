import angular from 'angular';

import service from './auto-generate-name';

const moduleName = 'ovhManagerPciComponentsAutoGenerateName';

angular.module(moduleName, []).service('PciAutoGenerateNameService', service);

export default moduleName;
