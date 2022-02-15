import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './connector-config.component';
import routing from './connector-config.routing';

import connectorInput from '../../../../components/connector-input';
import connectorPreview from '../../../../components/connector-preview';

const moduleName = 'ovhManagerPciStoragesDatabaseConnectorConfig';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    connectorInput,
    connectorPreview,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseConnectorConfigComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
