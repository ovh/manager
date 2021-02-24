import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-at-internet';
import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerPciServingOnboarding';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngAtInternet',
    OnboardingLayoutHelper,
  ])
  .config(routing)
  .component('pciProjectServingOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
