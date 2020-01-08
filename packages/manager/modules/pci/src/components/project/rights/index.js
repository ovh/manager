import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectRights';

angular
  .module(moduleName, ['ovh-api-services'])
  .service('CloudProjectRightService', service);

export default moduleName;
