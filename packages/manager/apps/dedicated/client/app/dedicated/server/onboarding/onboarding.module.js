import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'dedicatedServerOnboarding';

angular
  .module(moduleName, [OnboardingLayoutHelper])
  .component('dedicatedServerOnboardingComponent', component)
  .config(routing);

export default moduleName;
