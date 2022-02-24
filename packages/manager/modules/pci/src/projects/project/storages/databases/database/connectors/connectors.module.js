import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './connectors.component';
import routing from './connectors.routing';

import restartButton from '../../components/restart-button';
import connectorsList from './connectors-actions/connectors-list';
import connectorDelete from './connectors-actions/delete-connector';
import connectorAddConfig from './connectors-actions/add-connector-config';
import connectorEditConfig from './connectors-actions/edit-connector-config';
import connectorTasks from './connectors-actions/show-tasks';

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
