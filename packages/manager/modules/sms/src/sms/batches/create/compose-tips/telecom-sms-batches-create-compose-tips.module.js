import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesCreateComposeTipsModule';

angular
  .module(moduleName, ['oui', 'ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
