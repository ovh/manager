import angular from 'angular';

import infrastructure from './infrastructure';
import storage from './storage';
import volumes from './volumes';

import factory from './factory';

const moduleName = 'ovhManagerPciComponentsProjectCompute';

angular
  .module(moduleName, [
    infrastructure,
    storage,
    volumes,
  ])
  .factory('CloudProjectComputeFactory', factory);

export default moduleName;
