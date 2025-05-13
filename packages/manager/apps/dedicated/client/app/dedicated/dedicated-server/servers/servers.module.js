import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './servers.component';
import routing from './servers.routing';

const moduleName = 'ovhManagerDedicatedServerServers';

angular
  .module(moduleName, [ngOvhFeatureFlipping])
  .component('dedicatedServerServers', component)
  .config(routing)
  .run(/* @ngTranslationsInject ./translations ./server/translations */);

export default moduleName;
