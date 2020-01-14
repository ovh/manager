import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-ssl-certificate-preview.routing';
import previewComponent from './iplb-ssl-certificate-preview.component';

const moduleName = 'ovhManagerIplbSslCertificatePreviewModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbSslCertificatePreview', previewComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
