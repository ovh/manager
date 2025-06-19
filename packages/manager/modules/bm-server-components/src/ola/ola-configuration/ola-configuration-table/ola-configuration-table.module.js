import component from './ola-configuration-table.component';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaConfigurationTable';

angular
  .module(moduleName, [])
  .component('dedicatedServerInterfacesOlaConfigurationTable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
