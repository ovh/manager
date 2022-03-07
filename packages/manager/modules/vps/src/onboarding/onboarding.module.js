import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'vpsOnboarding';

angular
  .module(moduleName, [OnboardingLayoutHelper])
  .component('vpsOnboardingComponent', component)
  .config(routing);

export default moduleName;
