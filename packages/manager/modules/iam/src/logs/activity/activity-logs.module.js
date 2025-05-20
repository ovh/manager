import routing from './activity-logs.routing';
import dataStreams from './data-streams';
import service from './activity-logs.service';

const moduleName = 'ovhManagerIAMActivityLogs';

angular
  .module(moduleName, [dataStreams])
  .config(routing)
  .service('activityLogsService', service);

export default moduleName;
