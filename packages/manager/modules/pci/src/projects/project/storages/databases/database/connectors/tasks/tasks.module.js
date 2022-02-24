import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './tasks.component';
import routing from './tasks.routing';

import connectorEditConfig from '../edit-connector';
import restartButton from '../../../components/restart-button';

const moduleName = 'ovhManagerPciStoragesDatabaseConnectorTasks';
angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    restartButton,
    connectorEditConfig,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseConnectorTasksComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
