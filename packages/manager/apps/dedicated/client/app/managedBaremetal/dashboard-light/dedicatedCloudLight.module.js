import angular from 'angular';

import dashboardLightModule from '../../components/dedicated-cloud/dashboard-light';
import routing from './dedicatedCloudLight.routing';

const moduleName = 'ovhManagerManagedBaremetalLightModule';

angular.module(moduleName, [dashboardLightModule]).config(routing);

export default moduleName;