import component from './interfaces-rename.component';

const moduleName = 'ovhManagerDedicatedServerInterfacesRename';

angular
  .module(moduleName, ['ovh-api-services'])
  .component('dedicatedServerInterfacesRename', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
