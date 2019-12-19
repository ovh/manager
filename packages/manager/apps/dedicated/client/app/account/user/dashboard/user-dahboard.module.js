import component from './user-dasboard.component';
import routing from './user-dashboard.routing';

import './user-dashboard.less';

const moduleName = 'ovhManagerDedicatedUserAccountDashboard';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('userAccountDashboard', component);

export default moduleName;
