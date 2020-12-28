import component from './upgrade.component';
import { name as serviceName, UpgradeService } from './upgrade.service';

const moduleName = 'ovhManagerPccServicePackUpgradeComponent';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, UpgradeService);

export default moduleName;
