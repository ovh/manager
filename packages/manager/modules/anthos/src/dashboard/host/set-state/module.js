import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import restartComponent from './component';
import routing from './routing';

const moduleName = 'ovhManagerAnthosDashboardSetStateHost';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('anthosHostSetState', restartComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
