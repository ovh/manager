import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './add-connector.component';
import routing from './add-connector.routing';

import connectorInput from '../../../components/connector-input';
import connectorPreview from '../../../components/connector-preview';

const moduleName = 'ovhManagerPciStoragesDatabaseAddConnector';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    connectorInput,
    connectorPreview,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseAddConnectorComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
