import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './cli.component';
import routing from './cli.routing';

import aiCodeSampleComponent from '../../components/ai-code-sample';
import aiGuideComponent from '../../components/ai-guide';

const moduleName = 'ovhManagerPciAIDashboardCli';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'oui',
    aiCodeSampleComponent,
    aiGuideComponent,
  ])
  .config(routing)
  .component('pciProjectAIDashboardCli', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
