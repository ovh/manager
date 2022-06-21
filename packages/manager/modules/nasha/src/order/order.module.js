import angular from 'angular';

import '@uirouter/angularjs';
import { region } from '@ovh-ux/manager-components';
import '@ovh-ux/manager-catalog-price';
import '@ovh-ux/manager-billing-components';
import '@ovh-ux/manager-core';

import routing from './order.routing';
import component from './order.component';

const moduleName = 'ovhManagerNashaOrder';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCatalogPrice',
    'ovhManagerBilling',
    'ovhManagerCore',
    region,
  ])
  .component('nashaOrder', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
