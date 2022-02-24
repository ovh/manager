import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './connectors.component';
import routing from './connectors.routing';

import restartButton from '../../components/restart-button';
import connectorsList from './available-connectors';
import connectorDelete from './delete-connector';
import connectorAddConfig from './add-connector';
import connectorEditConfig from './edit-connector';
import connectorTasks from './tasks';

const moduleName = 'ovhManagerPciStoragesDatabaseConnectors';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    restartButton,
    connectorsList,
    connectorDelete,
    connectorAddConfig,
    connectorEditConfig,
    connectorTasks,
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseConnectors', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
