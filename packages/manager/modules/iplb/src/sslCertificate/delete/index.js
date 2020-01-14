import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-ssl-certificate-delete.routing';
import deleteComponent from './iplb-ssl-certificate-delete.component';

const moduleName = 'ovhManagerIplbSslCertificateDeleteModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbSslCertificateDelete', deleteComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
