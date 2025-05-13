import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './advanced-configuration.component';
import routing from './advanced-configuration.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseAdvancedConfiguration';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseAdvancedConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
