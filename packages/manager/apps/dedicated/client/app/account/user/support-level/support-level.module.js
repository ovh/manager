import component from './support-level.component';

import routing from './support-level.routing';

import './index.scss';

const moduleName = 'ovhManagerDedicatedAccountUserSupportLevel';

angular
  .module(moduleName, [])
  .config(routing)
  .component('accountUserSupportLevel', component);

export default moduleName;
