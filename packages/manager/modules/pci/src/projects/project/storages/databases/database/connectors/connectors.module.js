import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './connectors.component';
import routing from './connectors.routing';

import restartButton from '../../components/restart-button';
import deleteConnector from './delete-connector';
import availableConnectors from './available-connectors';
import addConnector from './add-connector';
import editConnector from './edit-connector';
import tasks from './tasks';

const moduleName = 'ovhManagerPciStoragesDatabaseConnectors';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    restartButton,
    deleteConnector,
    availableConnectors,
    addConnector,
    editConnector,
    tasks,
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseConnectors', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
