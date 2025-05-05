import '@uirouter/angularjs';

import dataStreams from '../../../components/logs/data-streams';
import routing from './audit-data-streams.routing';

const moduleName = 'ovhManagerIAMAuditLogsDataStreams';
angular.module(moduleName, ['ui.router', dataStreams]).config(routing);

export default moduleName;
