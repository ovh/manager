import angular from 'angular';

import routing from './vsphere-user-password-reset.routes';
import userPasswordResetComponent from '../../../../components/dedicated-cloud/users/vsphere-users/password/reset';

const moduleName = 'dedicatedCloudVsphereUserPasswordResetModule';

angular.module(moduleName, [userPasswordResetComponent]).config(routing);

export default moduleName;
