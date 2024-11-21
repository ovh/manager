import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './support-level.component';

import routing from './support-level.routing';

import './index.scss';

const moduleName = 'ovhManagerDedicatedAccountUserSupportLevel';

angular
  .module(moduleName, [ngOvhFeatureFlipping])
  .config(routing)
  .component('accountUserSupportLevel', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
