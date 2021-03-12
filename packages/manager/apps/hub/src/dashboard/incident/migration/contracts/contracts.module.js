import angular from 'angular';
import 'angular-translate';
import ngOvhContracts from '@ovh-ux/ng-ovh-contracts';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './contracts.component';
import routing from './routing';

const moduleName = 'ovhManagerHubIncidentMigrationContract';

angular
  .module(moduleName, [
    ngOvhContracts,
    ngOvhTranslateAsyncLoader,
    ngOvhUiRouterLayout,
    'oui',
    'pascalprecht.translate',
    uiRouter,
  ])
  .component('hubIncidentMigrationContracts', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
