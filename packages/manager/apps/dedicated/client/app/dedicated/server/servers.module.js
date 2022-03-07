import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import onboarding from './onboarding';

import component from './servers.component';
import routing from './servers.routing';

const moduleName = 'ovhManagerDedicatedServerServers';

angular
  .module(moduleName, [ngOvhFeatureFlipping, onboarding])
  .component('dedicatedServerServers', component)
  .config(routing)
  .run(/* @ngTranslationsInject ./translations ./details/translations */);

export default moduleName;
