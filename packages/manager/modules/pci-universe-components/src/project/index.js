import angular from 'angular';
import 'ovh-api-services';

import regionsList from './regions-list';

const moduleName = 'ovhManagerPciUniverseComponentsProject';

angular.module(moduleName, ['ovh-api-services', regionsList]);

export default moduleName;
