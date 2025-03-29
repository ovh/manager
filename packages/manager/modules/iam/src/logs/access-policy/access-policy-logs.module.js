import routing from './access-policy-logs.routing';
import dataStreams from './data-streams';
import service from './access-policy-logs.service';

const moduleName = 'ovhManagerIAMAuditLogs';

angular
  .module(moduleName, [dataStreams])
  .config(routing)
  .service('accessPolicyLogsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
