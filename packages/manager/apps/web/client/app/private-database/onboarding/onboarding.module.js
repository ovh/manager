import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'privateDatabasesOnboarding';

angular
  .module(moduleName, [OnboardingLayoutHelper])
  .component('privateDatabasesOnboardingComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
