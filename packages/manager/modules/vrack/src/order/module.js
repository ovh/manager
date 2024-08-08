import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'vrackOrder';

angular
  .module(moduleName, ['ui.router', 'ui.bootstrap', 'oui'])
  .component('vrackOrderComponent', component)
  .config(routing)
  .service('VrackOrderService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
