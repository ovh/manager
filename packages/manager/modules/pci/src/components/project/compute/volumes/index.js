import angular from 'angular';

import factory from './factory';
import service from './service';
import volumeFactory from './volume/factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeVolumes';

angular
  .module(moduleName, [])
  .factory('CloudProjectComputeVolumesFactory', factory)
  .factory('CloudProjectComputeVolumesVolumeFactory', volumeFactory)
  .service('CloudProjectComputeVolumesOrchestrator', service);

export default moduleName;
