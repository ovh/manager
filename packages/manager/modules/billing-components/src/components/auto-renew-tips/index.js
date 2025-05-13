import component from './auto-renew-tips.component';

const moduleName = 'ovhManagerAutoRenewTips';

angular
  .module(moduleName, ['oui'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
