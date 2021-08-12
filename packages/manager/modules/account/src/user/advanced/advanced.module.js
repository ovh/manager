import ovhManagerBetaPreference from '@ovh-ux/manager-beta-preference';

import component from './advanced.component';
import routing from './advanced.routing';

const moduleName = 'ovhManagerDedicatedAccountUserAdvanced';

angular
  .module(moduleName, [ovhManagerBetaPreference])
  .config(routing)
  .component('accountUserAdvanced', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
