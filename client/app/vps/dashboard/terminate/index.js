import component from './vps-terminate.component';
import routing from './vps-terminate.routing';
import service from './vps-terminate.service';

const moduleName = 'ovhManagerVpsTerminate';

angular
  .module(moduleName, [])
  .config(routing)
  .component(component.name, component)
  .service('vpsTerminate', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
