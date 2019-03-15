import angular from 'angular';

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
    prices,
    rights,
  ])
  .factory('CloudProjectFactory', factory)
  .service('CloudProjectOrchestrator', service);

export default moduleName;
