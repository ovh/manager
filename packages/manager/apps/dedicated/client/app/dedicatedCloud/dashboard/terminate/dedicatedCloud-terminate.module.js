import angular from 'angular';

import dedicatedCloudTerminateComponent from '../../../components/dedicated-cloud/terminate';
import routing from './dedicatedCloud-terminate.routes';

const moduleName = 'dedicatedCloudTerminateModule';

angular.module(moduleName, [dedicatedCloudTerminateComponent]).config(routing);

export default moduleName;
