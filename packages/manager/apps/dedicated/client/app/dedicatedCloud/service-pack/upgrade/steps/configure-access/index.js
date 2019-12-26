import component from './configure-access.component';
import { factory, name as factoryName } from './configure-access.factory';

const moduleName = 'ovhManagerPccServicePackUpgradeConfigureAccess';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .factory(factoryName, factory)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
