import angular from 'angular';

import cucBytes from '../bytes';

import {
  FLAVORTYPE_CATEGORY,
  INSTANCE_CPU_FREQUENCY,
  INSTANCE_NUMBER_OF_GPUS,
} from './constants';

import service from './service';

const moduleName = 'cucFlavor';

angular
  .module(moduleName, [cucBytes])
  .constant('CUC_FLAVOR_FLAVORTYPE_CATEGORY', FLAVORTYPE_CATEGORY)
  .constant('CUC_FLAVOR_INSTANCE_CPU_FREQUENCY', INSTANCE_CPU_FREQUENCY)
  .constant('CUC_FLAVOR_INSTANCE_NUMBER_OF_GPUS', INSTANCE_NUMBER_OF_GPUS)
  .service('CucFlavorService', service);

export default moduleName;
