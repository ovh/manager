import angular from 'angular';

import datacenterDeactivateLogs from '../../../components/dedicated-cloud/dashboard/tiles/options/components/logs/deactivate';
import routing from './dedicatedCloud-deactivate-logs.routing';

const moduleName = 'dedicatedCloudDeactivateLogs';

angular.module(moduleName, [datacenterDeactivateLogs]).config(routing);

export default moduleName;
