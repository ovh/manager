import component from './api-keys.component';
import routing from './api-keys.routing';
import _delete_ from './delete';

const moduleName = 'ovhManagerIAMApiKeys';

angular
  .module(moduleName, [_delete_])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
