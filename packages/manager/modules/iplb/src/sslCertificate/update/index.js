import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-ssl-certificate-update.routing';
import updateComponent from './iplb-ssl-certificate-update.component';

const moduleName = 'ovhManagerIplbSslCertificateUpdateModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbSslCertificateUpdate', updateComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
