import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import routing from './data-integration.routing';
import component from './data-integration.component';
import service from './data-integration.service';

import onboarding from './onboarding';
import dashboard from './tabs/dashboard';
import sources from './tabs/sources';
import destinations from './tabs/destinations';
import cli from './tabs/cli';

const moduleName = 'ovhManagerPciDataIntegration';

angular
  .module(moduleName, [
    onboarding,
    dashboard,
    sources,
    destinations,
    cli,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDataIntegration', component)
  .service('DataIntegrationService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
