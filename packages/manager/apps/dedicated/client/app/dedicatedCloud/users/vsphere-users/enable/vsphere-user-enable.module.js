import angular from 'angular';

import routing from './vsphere-user-enable.routes';
import userEnableComponent from '../../../../components/dedicated-cloud/users/vsphere-users/enable';

const moduleName = 'dedicatedCloudVsphereUserEnableModule';

angular.module(moduleName, [userEnableComponent]).config(routing);

export default moduleName;
