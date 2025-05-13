import component from './ola-reset.component';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaReset';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedServerInterfacesOlaReset', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
