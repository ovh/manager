import angular from 'angular';

import dedicatedCloudTerminateComponent from '../../../components/dedicated-cloud/terminate';
import routing from './terminate.routes';

const moduleName = 'managedBaremetalTerminateModule';

angular.module(moduleName, [dedicatedCloudTerminateComponent]).config(routing);

export default moduleName;
