import component from './interfaces-rename.component';
import routing from './interfaces-rename.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesRename';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('dedicatedServerInterfacesRename', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
