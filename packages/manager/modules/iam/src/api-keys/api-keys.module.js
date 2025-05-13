import component from './api-keys.component';
import routing from './api-keys.routing';
import onboarding from './onboarding';
import deletion from './delete';

const moduleName = 'ovhManagerIAMApiKeys';

angular
  .module(moduleName, [onboarding, deletion])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
