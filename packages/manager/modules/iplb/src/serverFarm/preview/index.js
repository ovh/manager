import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-server-farm-preview.routing';
import previewComponent from './iplb-server-farm-preview.component';

const moduleName = 'ovhManagerIplbServerFarmPreview';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbServerFarmPreview', previewComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
