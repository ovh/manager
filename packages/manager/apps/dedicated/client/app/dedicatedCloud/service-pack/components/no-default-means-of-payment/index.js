import component from './no-default-means-of-payment.component';

const moduleName = 'ovhManagerServicePackNoDefaultMeansOfPayment';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
