import component, { name } from './accountDelegation.component';

const moduleName = 'ovhManagerIAMComponentsDelegationAccount';

angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
