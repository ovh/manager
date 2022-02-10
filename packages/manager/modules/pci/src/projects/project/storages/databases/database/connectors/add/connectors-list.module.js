import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './connectors-list.component';
import routing from './connectors-list.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseConnectorsList';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseConnectorsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
