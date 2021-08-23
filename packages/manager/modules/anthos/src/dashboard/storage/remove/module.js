import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import removeComponent from './component';
import routing from './routing';

const moduleName = 'ovhManagerAnthosDashboardStorageRemove';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('anthosRemoveStorage', removeComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
