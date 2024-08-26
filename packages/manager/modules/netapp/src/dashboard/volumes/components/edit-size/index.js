import angular from 'angular';
import component from './component';
import service from './service';

const moduleName = 'ovhManagerNetAppVolumesEditSizeModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .service('EditSizeService', service)
  .component('ovhManagerNetAppVolumesEditSizeComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
