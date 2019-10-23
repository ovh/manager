import angular from 'angular';
import component from './manager-order-payment-means.component';

const moduleName = 'ovhManagerOrderPaymentMeans';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('ovhManagerOrderPaymentMeans', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
