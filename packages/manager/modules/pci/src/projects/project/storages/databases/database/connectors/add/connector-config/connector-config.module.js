import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './connector-config.component';
import routing from './connector-config.routing';

import connectorInput from '../../../../components/connector-input';

const moduleName = 'ovhManagerPciStoragesDatabaseConnectorConfig';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    connectorInput,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseConnectorConfigComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
