import component from './logs.component';
import service from './logs.service';

const moduleName = 'ovhManagerPccDashboardOptionsLogs';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .service('logsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
