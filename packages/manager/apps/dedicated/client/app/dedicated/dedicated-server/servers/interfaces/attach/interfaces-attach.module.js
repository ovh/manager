import component from './interfaces-attach.component';
import routing from './interfaces-attach.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesAttach';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('dedicatedServerInterfacesAttach', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
