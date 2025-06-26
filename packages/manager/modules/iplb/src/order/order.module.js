import component from './order.component';
import routing from './order.routing';

const moduleName = 'iplbOrder';

angular
  .module(moduleName, [])
  .component('iplbOrderComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
