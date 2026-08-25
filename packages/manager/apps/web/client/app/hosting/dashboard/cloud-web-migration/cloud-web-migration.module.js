import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import atInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';

import component from './cloud-web-migration.component';
import routing from './cloud-web-migration.routing';
import service from './cloud-web-migration.service';

const moduleName = 'ovhManagerHostingCloudWebMigration';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    atInternet,
    ngAtInternetUiRouterPlugin,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('hostingCloudWebMigrationComponent', component)
  .service('HostingCloudWebMigrationService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
