import angular from 'angular';

import routing from './vsphere-user-iam-role.routes';
import UserIamRoleComponent from '../../../../components/dedicated-cloud/users/vsphere-users/iam-role';

const moduleName = 'managedBaremetalVsphereUserIamRoleModule';

angular.module(moduleName, [UserIamRoleComponent]).config(routing);

export default moduleName;
