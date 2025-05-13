import component from './interfaces-detach.component';

const moduleName = 'ovhManagerDedicatedServerInterfacesDetach';

angular
  .module(moduleName, ['ovh-api-services'])
  .component('dedicatedServerInterfacesDetach', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
