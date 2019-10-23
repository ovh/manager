import angular from 'angular';
import component from './order-payment-means.component';

const moduleName = 'orderPaymentMeans';

angular
  .module(moduleName, [])
  .component('orderPaymentMeans', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
