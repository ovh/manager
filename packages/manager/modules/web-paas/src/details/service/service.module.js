import angular from 'angular';
import 'angular-translate';

import ovhManagerBilling from '@ovh-ux/manager-billing';
import component from './service.component';
import routing from './service.routing';
import changeOffer from './change-offer';
import addAddon from './add-addon';

const moduleName = 'ovhManagerWebPaasDetailsService';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    ovhManagerBilling,
    addAddon,
    changeOffer,
  ])
  .config(routing)
  .component('webPaasDetailsService', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
