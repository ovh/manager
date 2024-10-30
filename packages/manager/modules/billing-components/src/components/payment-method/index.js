import component from './payment-method.component';

const moduleName = 'ovhManagerAutoRenewPaymentMethod';

angular
  .module(moduleName, ['oui'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
