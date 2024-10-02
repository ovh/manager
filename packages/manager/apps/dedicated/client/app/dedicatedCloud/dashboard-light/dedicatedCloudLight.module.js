import angular from 'angular';

import dashboardLightModule from '../../components/dedicated-cloud/dashboard-light';
import routing from './dedicatedCloudLight.routing';

const moduleName = 'ovhManagerDedicatedCloudLightModule';

angular.module(moduleName, [dashboardLightModule]).config(routing);

export default moduleName;
