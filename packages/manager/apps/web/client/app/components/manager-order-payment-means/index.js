import angular from 'angular';
import component from './manager-order-payment-means.component';

const moduleName = 'ovhManagerOrderPaymentMeans';

angular
  .module(moduleName, [])
  .component('ovhManagerOrderPaymentMeans', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
