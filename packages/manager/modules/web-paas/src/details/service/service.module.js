import angular from 'angular';
import 'angular-translate';

import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import component from './service.component';
import routing from './service.routing';
import changeOffer from './change-offer';
import addAddon from './add-addon';

const moduleName = 'ovhManagerWebPaasDetailsService';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    ovhManagerBillingComponents,
    addAddon,
    changeOffer,
  ])
  .config(routing)
  .component('webPaasDetailsService', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
