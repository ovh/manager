import angular from 'angular';
import component from './component';

const moduleName = 'ovhManagerNetAppVolumesEditSizeModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('ovhManagerNetAppVolumesEditSizeComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
