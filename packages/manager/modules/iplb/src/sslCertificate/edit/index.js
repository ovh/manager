import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-ssl-certificate-edit.routing';
import editComponent from './iplb-ssl-certificate-edit.component';

const moduleName = 'ovhManagerIplbSslCertificateEditModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbSslCertificateEdit', editComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
