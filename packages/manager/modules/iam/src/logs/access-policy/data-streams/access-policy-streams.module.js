import '@uirouter/angularjs';

import dataStreams from '../../../components/logs/data-streams';
import routing from './access-policy-streams.routing';

const moduleName = 'ovhManagerIAMAccessPolicyLogsDataStreams';
angular.module(moduleName, ['ui.router', dataStreams]).config(routing);

export default moduleName;
