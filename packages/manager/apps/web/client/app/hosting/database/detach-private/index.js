import angular from 'angular';
import productOffers from '@ovh-ux/manager-product-offers';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerHostingDatabaseDetachPrivateModule';

angular
  .module(moduleName, [
    productOffers,
    'oui',
    'ui.router',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .config(routing);

export default moduleName;
