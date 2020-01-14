import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-server-preview.routing';
import previewComponent from './iplb-server-preview.component';

const moduleName = 'ovhManagerIplbServerPreviewModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbServerPreview', previewComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
