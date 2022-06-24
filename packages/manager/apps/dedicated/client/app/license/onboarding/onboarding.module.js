import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'licenseOnboarding';

angular
  .module(moduleName, [OnboardingLayoutHelper])
  .component('licenseOnboardingComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
