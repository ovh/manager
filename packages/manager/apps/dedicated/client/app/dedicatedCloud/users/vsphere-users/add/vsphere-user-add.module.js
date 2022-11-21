import angular from 'angular';

import routing from './vsphere-user-add.routes';
import userAddComponent from '../../../../components/dedicated-cloud/users/vsphere-users/add';

const moduleName = 'dedicatedCloudVsphereUserAddModule';

angular.module(moduleName, [userAddComponent]).config(routing);

export default moduleName;
