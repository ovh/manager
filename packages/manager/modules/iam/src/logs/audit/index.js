import component, { name } from './audit-logs.component';
import routing from './audit-logs.routing';
import dataStreams from './data-streams';

const moduleName = 'ovhManagerIAMAuditLogs';

angular
  .module(moduleName, [dataStreams])
  .config(routing)
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
