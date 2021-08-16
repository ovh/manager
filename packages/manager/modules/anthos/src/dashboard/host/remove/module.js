import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import removeComponent from './component';
import routing from './routing';

const moduleName = 'ovhManagerAnthosDashboardRemoveHost';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('anthosRemoveHost', removeComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
