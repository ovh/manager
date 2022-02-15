import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './connectors.component';
import routing from './connectors.routing';

import connectorsList from './connectors-actions/connectors-list';
import connectorConfig from './connectors-actions/add-connector-config';

const moduleName = 'ovhManagerPciStoragesDatabaseConnectors';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    connectorsList,
    connectorConfig,
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseConnectors', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
