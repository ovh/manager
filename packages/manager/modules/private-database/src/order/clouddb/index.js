import angular from 'angular';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-contracts';
import '@ovh-ux/manager-core';

import component from './private-database-order-clouddb.component';
import routing from './private-database-order-clouddb.routing';
import service from './private-database-order-clouddb.service';

const moduleName = 'ovhManagerWebPrivateDatabaseOrderClouddb';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngOvhWebUniverseComponents',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    'ngOvhPaymentMethod',
    'ngOvhUtils',
    'ngOvhContracts',
  ])
  .component(component.name, component)
  .service('PrivateDatabaseOrderCloudDb', service)
  .config(routing);

export default moduleName;
