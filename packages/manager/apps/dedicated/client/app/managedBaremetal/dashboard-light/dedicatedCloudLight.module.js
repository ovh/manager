import angular from 'angular';

import dashboardLightModule from '../../components/dedicated-cloud/dashboard-light';
import associateIpBloc from './associate-ip-bloc';
import routing from './dedicatedCloudLight.routing';

const moduleName = 'ovhManagerManagedBaremetalLightModule';

angular
  .module(moduleName, [dashboardLightModule, associateIpBloc])
  .config(routing);

export default moduleName;
