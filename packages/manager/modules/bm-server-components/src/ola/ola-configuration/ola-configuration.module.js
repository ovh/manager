import component from './ola-configuration.component';
import olaConfigurationTable from './ola-configuration-table/ola-configuration-table.module';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaConfiguration';

angular
  .module(moduleName, [olaConfigurationTable])
  .component('dedicatedServerInterfacesOlaConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
