import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerPciAiDashboardOnboarding';

import aiPipeline from '../components/ai-pipeline';
import aiGuideComponent from '../components/ai-guide';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    aiPipeline,
    aiGuideComponent,
  ])
  .config(routing)
  .component('pciProjectAiDashboardOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
