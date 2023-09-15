import component from './ola-configuration.component';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaConfiguration';

angular
  .module(moduleName, [])
  .component('dedicatedServerInterfacesOlaConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
