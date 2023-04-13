import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import routing from './etl.routing';
import component from './etl.component';
import service from './etl.service';

import onboarding from './onboarding';
import home from './tabs/home';
import cli from './tabs/cli';

const moduleName = 'ovhManagerPciEtl';

angular
  .module(moduleName, [
    onboarding,
    home,
    cli,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectEtl', component)
  .service('EtlService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
