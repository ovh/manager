import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-frontends-preview.routing';
import previewComponent from './iplb-frontends-preview.component';

const moduleName = 'ovhManagerIplbFrontendspreviewModule';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerIplbFrontendsPreview', previewComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
