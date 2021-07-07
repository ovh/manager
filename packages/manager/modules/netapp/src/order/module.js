import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import { region } from '@ovh-ux/manager-components';
import '@ovh-ux/manager-catalog-price';
import '@ovh-ux/manager-billing-components';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppOrder';

angular
  .module(moduleName, [
    'ovhManagerBilling',
    'ovhManagerCore',
    'ovhManagerCatalogPrice',
    'pascalprecht.translate',
    'ui.router',
    region,
  ])
  .config(routing)
  .component('ovhManagerNetAppOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
