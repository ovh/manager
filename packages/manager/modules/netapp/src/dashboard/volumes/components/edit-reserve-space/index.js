import angular from 'angular';
import component from './component';
import service from './service';

const moduleName = 'ovhManagerNetAppVolumesEditReserveSpaceModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .service('EditReserveSpaceService', service)
  .component('ovhManagerNetAppVolumesEditReserveSpaceComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
