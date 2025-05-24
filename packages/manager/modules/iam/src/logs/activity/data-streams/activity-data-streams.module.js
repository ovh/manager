import '@uirouter/angularjs';

import dataStreams from '../../../components/logs/data-streams';
import routing from './activity-data-streams.routing';

const moduleName = 'ovhManagerIAMActivityLogsDataStreams';
angular.module(moduleName, ['ui.router', dataStreams]).config(routing);

export default moduleName;
