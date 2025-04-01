import routing from './audit-logs.routing';
import dataStreams from './data-streams';
import service from './audit-logs.service';

const moduleName = 'ovhManagerIAMAuditLogs';

angular
  .module(moduleName, [dataStreams])
  .config(routing)
  .service('auditLogsService', service);

export default moduleName;
