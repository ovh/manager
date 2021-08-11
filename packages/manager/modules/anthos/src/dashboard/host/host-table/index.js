import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerAnthosDashboardHostTable';

angular
  .module(moduleName, ['oui', 'ovhManagerCore', 'pascalprecht.translate'])
  .component('anthosHostTable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
