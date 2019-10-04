import angular from 'angular';
import paymentInfoComponent from './payment-info.component';

const moduleName = 'enterpriseCloudDatabasePaymentInfoComponent';

angular
  .module(moduleName, [])
  .component('enterpriseCloudDatabasePaymentInfoComponent', paymentInfoComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
