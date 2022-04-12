import angular from 'angular';
import '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerPciComponentsSupportTicketBanner';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'oui'])
  .component('supportTicketBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
