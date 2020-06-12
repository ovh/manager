import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './onboarding.component';
import empty from '../../../../components/project/empty';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerPciWorkflowOnboardingModule';

angular
  .module(moduleName, [
    empty,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectWorkflowOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
