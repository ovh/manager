import '@uirouter/angularjs';

import component, { name } from './data-streams.component';
import routing from './data-streams.routing';

const moduleName = 'ovhManagerIAMAuditLogsDataStreams';
angular
  .module(moduleName, ['ui.router'])
  .component(name, component)
  .config(routing);

export default moduleName;
