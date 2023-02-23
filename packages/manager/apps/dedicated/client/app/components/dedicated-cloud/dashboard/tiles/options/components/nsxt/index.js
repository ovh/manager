import component from './nsxt.component';
import service from './nsxt.service';

const moduleName = 'ovhManagerPccDashboardOptionsNsxt';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .service('optionsNsxtService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
