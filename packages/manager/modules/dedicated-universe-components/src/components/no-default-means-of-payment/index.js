import component from './no-default-means-of-payment.component';

const moduleName = 'ovhManagerNoDefaultMeansOfPaymentModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
