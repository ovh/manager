import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import add from './add';
import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerPciUsersOnboarding';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    add,
    OnboardingLayoutHelper,
  ])
  .config(routing)
  .component('pciProjectUsersOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
