import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-task-preview.routing';
import previewComponent from './iplb-task-preview.component';

const moduleName = 'ovhManagerIplbtaskpreviewModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbTaskPreview', previewComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
