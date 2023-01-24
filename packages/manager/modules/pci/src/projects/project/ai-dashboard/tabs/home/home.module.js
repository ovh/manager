import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './home.component';
import routing from './home.routing';

import aiGuideComponent from '../../components/ai-guide';

const moduleName = 'ovhManagerPciAiDashboardHome';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    aiGuideComponent,
  ])
  .config(routing)
  .component('pciProjectAiDashboardHome', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
