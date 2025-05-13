import component from './validation.component';
import { name as factoryName, factory } from './validation.factory';

const moduleName = 'ovhManagerPccServicePackUpgradeValidation';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .factory(factoryName, factory);

export default moduleName;
