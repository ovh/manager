import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import reinstallComponent from './component';
import routing from './routing';

const moduleName = 'ovhManagerAnthosDashboardReinstallHost';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('anthosReinstallHost', reinstallComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
