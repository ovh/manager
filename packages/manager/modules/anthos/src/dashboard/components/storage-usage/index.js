import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import './index.less';
import component from './component';

const moduleName = 'ovhManagerAnthosDashboardStorageUsage';

angular
  .module(moduleName, ['oui', 'ovhManagerCore', 'pascalprecht.translate'])
  .component('anthosStorageUsage', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
