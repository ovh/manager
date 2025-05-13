import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './available-connectors.component';
import routing from './available-connectors.routing';

import connectorConfig from '../add-connector';

const moduleName = 'ovhManagerPciStoragesDatabaseAvailableConnectors';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    connectorConfig,
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseAvailableConnectors', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
