import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'emailProOnboarding';

angular
  .module(moduleName, [OnboardingLayoutHelper])
  .component('emailProOnboardingComponent', component)
  .config(routing);

export default moduleName;
