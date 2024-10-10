import angular from 'angular';

import component from './vrack-terminate-modal.component';

const moduleName = 'ovhManagerVrackTerminateModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('ovhManagerVrackTerminateComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
