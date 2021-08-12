import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixOnboarding';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    OnboardingLayoutHelper,
  ])
  .config(routing)
  .component('nutanixOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
