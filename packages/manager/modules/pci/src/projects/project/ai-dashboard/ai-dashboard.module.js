import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import routing from './ai-dashboard.routing';
import component from './ai-dashboard.component';
import service from './ai-dashboard.service';
import registries from './tabs/registries';

import aiPipelineComponent from './components/ai-pipeline';

import onboarding from './onboarding';
import home from './tabs/home';
import usersTokens from './tabs/users-tokens';
import cli from './tabs/cli';

const moduleName = 'ovhManagerPciAiDashboard';

angular
  .module(moduleName, [
    onboarding,
    home,
    usersTokens,
    cli,
    registries,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    aiPipelineComponent,
  ])
  .config(routing)
  .component('ovhManagerPciProjectAiDashboard', component)
  .service('AiDashboardService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
