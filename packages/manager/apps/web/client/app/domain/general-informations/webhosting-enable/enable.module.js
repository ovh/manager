import 'angular-translate';
import ovhManagerOrder from '@ovh-ux/manager-order';
import productOffers from '@ovh-ux/manager-product-offers';

import routing from './routing';
import component from './enable.component';
import service from './webhosting-enable.service';

const moduleName = 'ovhManagerWebDomainHostingEnable';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    ovhManagerOrder,
    productOffers,
    'ui.router',
  ])
  .config(routing)
  .component('domainWebhostingEnable', component)
  .service('WebhostingEnableService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
