import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'sharepointOnboarding';

angular
  .module(moduleName, [OnboardingLayoutHelper])
  .component('sharepointOnboardingComponent', component)
  .config(routing);

export default moduleName;
