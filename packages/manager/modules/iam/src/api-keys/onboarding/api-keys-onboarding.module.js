import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import component from './api-keys-onboarding.component';
import routing from './api-keys-onboarding.routing';

const moduleName = 'ovhManagerIAMApiKeysOnboarding';

angular
  .module(moduleName, [OnboardingLayoutHelper])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
