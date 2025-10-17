import angular from 'angular';

import service, { name } from './resourceType.service';

const moduleName = 'ovhManagerIAMComponentsResourceType';

angular.module(moduleName, []).service(name, service);

export default moduleName;
