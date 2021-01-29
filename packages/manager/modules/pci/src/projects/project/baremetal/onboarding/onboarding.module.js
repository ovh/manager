import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerPciBaremetalOnboarding';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    OnboardingLayoutHelper,
  ])
  .config(routing)
  .component('pciProjectBaremetalOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
