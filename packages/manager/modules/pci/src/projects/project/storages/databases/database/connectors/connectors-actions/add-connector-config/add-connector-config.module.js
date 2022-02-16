import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './add-connector-config.component';
import routing from './add-connector-config.routing';

import connectorInput from '../../../../components/connector-input';
import connectorPreview from '../../../../components/connector-preview';

const moduleName = 'ovhManagerPciStoragesDatabaseAddConnectorConfig';

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
  .component(
    'ovhManagerPciStoragesDatabaseAddConnectorConfigComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
