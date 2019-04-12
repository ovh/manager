import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import add from './add';
import billing from './billing';
import compute from './compute';
import empty from './empty';
import rights from './rights';

import factory from './factory';
import service from './service';

const moduleName = 'ovhManagerPciComponentsProject';

angular
  .module(moduleName, [
    add,
    billing,
    compute,
    empty,
    'ovh-api-services',
    rights,
  ])
  .factory('CloudProjectFactory', factory)
  .service('CloudProjectOrchestrator', service);

export default moduleName;
