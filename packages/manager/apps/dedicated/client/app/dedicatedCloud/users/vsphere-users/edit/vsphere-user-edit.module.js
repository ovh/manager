import angular from 'angular';

import routing from './vsphere-user-edit.routes';
import userEditComponent from '../../../../components/dedicated-cloud/users/vsphere-users/edit';

const moduleName = 'dedicatedCloudVsphereUserEditModule';

angular.module(moduleName, [userEditComponent]).config(routing);

export default moduleName;
