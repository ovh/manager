import component from './interfaces-attach.component';

const moduleName = 'ovhManagerDedicatedServerInterfacesAttach';

angular
  .module(moduleName, ['ovh-api-services'])
  .component('dedicatedServerInterfacesAttach', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
