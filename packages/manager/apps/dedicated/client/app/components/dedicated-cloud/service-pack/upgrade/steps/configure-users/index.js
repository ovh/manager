import component from './configure-users.component';
import { name as factoryName, factory } from './configure-users.factory';

const moduleName = 'ovhManagerPccServicePackUpgradeConfigureUsers';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .factory(factoryName, factory)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
