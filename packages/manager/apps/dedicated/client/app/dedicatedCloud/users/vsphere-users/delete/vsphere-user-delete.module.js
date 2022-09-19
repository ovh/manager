import angular from 'angular';

import routing from './vsphere-user-delete.routes';
import userDeleteComponent from '../../../../components/dedicated-cloud/users/vsphere-users/delete';

const moduleName = 'dedicatedCloudVsphereUserDeleteModule';

angular.module(moduleName, [userDeleteComponent]).config(routing);

export default moduleName;
