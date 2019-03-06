import angular from 'angular';

import infrastructure from './infrastructure';
import volumes from './volumes';

import factory from './factory';

const moduleName = 'ovhManagerPciComponentsProjectCompute';

angular
  .module(moduleName, [
    infrastructure,
    volumes,
  ])
  .factory('CloudProjectComputeFactory', factory);

export default moduleName;
