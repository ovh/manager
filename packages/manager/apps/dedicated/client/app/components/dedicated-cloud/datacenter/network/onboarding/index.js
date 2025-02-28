import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './dedicatedCloud-datacenter-network-onboarding.component';

const moduleName =
  'ovhManagerDedicatedCloudDatacenterNetworkOnboardingComponent';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', OnboardingLayoutHelper])
  .component('ovhManagerDedicatedCloudDatacenterNetworkOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
