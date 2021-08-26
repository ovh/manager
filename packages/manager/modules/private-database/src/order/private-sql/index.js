import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/manager-core';

import component from './private-database-order-private-sql.component';
import routing from './private-database-order-private-sql.routing';

const moduleName = 'ovhManagerWebPrivateDatabaseOrderPrivateSQL';

angular

  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    'ngOvhPaymentMethod',
    'ngOvhUtils',
  ])
  .config(routing)
  .component('privateDatabaseOrderPrivateSQL', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
