import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-ssl-certificate-order.routing';
import orderComponent from './iplb-ssl-certificate-order.component';

const moduleName = 'ovhManagerIplbSslCertificateOrderModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbSslCertificateOrder', orderComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
