import angular from 'angular';
import 'ovh-api-services';

import autoGenerateName from './auto-generate-name';
import regionsList from './regions-list';

const moduleName = 'ovhManagerPciUniverseComponentsProject';

angular.module(moduleName, ['ovh-api-services', autoGenerateName, regionsList]);

export default moduleName;
