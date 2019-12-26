import confirm from './confirm';

import component from './place-order.component';
import { factory, name as factoryName } from './place-order.factory';

const moduleName = 'ovhManagerPccServicePackUpgradePlaceOrder';

angular
  .module(moduleName, [confirm, 'oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(factoryName, factory);

export default moduleName;
