import routing from './access-policy-logs.routing';
import dataStreams from './data-streams';
import service from './access-policy-logs.service';

const moduleName = 'ovhManagerIAMAccessPolicyLogs';

angular
  .module(moduleName, [dataStreams])
  .config(routing)
  .service('accessPolicyLogsService', service);

export default moduleName;
