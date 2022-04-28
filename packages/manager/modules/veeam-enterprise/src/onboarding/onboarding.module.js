import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'veeamEnterpriseOnboarding';

angular
  .module(moduleName, [OnboardingLayoutHelper])
  .component('veeamEnterpriseOnboardingComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
