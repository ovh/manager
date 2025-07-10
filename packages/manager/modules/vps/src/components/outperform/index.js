import 'angular-translate';
import VpsService from '../../import/vps.service';
import VpsTaskService from '../../vps/vps-task.service';
import component from './outperform.component';
import routing from './outperform.routing';

const moduleName = 'ovhManagerVpsOutperform';

angular
  .module(moduleName, [])
  .component('vpsOutperformComponent', component)
  .service('VpsService', VpsService)
  .service('VpsTaskService', VpsTaskService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
