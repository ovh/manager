import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import add from './add';
import billing from './billing';
import compute from './compute';
import prices from './prices';
import rights from './rights';

import factory from './factory';
import service from './service';

const moduleName = 'ovhManagerPciComponentsProject';

angular
  .module(moduleName, [
    add,
    billing,
    compute,
    'ovh-api-services',
    prices,
    rights,
  ])
  .factory('CloudProjectFactory', factory)
  .service('CloudProjectOrchestrator', service);

export default moduleName;
