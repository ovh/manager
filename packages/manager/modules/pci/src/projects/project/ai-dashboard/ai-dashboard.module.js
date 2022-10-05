import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import routing from './ai-dashboard.routing';
import component from './ai-dashboard.component';
import service from './ai-dashboard.service';

import aiPipelineComponent from './components/ai-pipeline';

import onboarding from './onboarding';
import home from './tabs/home';
import usersTokens from './tabs/users-tokens';

const moduleName = 'ovhManagerPciAIDashboard';

angular
  .module(moduleName, [
    onboarding,
    home,
    usersTokens,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    aiPipelineComponent,
  ])
  .config(routing)
  .component('ovhManagerPciProjectAIDashboard', component)
  .service('AIDashboardService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
