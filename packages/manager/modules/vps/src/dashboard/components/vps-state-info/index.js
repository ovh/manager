import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './vps-state-info.component';

const moduleName = 'ovhManagerVpsDashboardVpsStateInfo';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vpsStateInfo', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
