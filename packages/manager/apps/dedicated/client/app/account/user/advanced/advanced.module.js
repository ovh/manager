import component from './advanced.component';

import routing from './advanced.routing';

const moduleName = 'ovhManagerDedicatedAccountUserAdvanced';

angular
  .module(moduleName, [])
  .config(routing)
  .component('accountUserAdvanced', component);

export default moduleName;
